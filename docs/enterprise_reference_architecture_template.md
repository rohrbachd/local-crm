# Enterprise Reference Architecture Template

**Purpose:** This template describes a maintainable, enterprise-grade reference architecture for long-lived applications. It is designed as a practical blueprint for teams that want clean object-oriented design, dependency injection, testability, extensibility, clear documentation, and sustainable software delivery.

**Recommended sample domain:** Offer / Purchase / Payment / Ticket Validation or Contact / Company / Lead / Task Integration.

**Core architectural principle:** Put business rules in the center. Keep frameworks, databases, APIs, and external systems at the edges. Make dependencies explicit. Make change cheap.

---

## 1. Why Build a Reference Architecture?

A reference architecture should not be a theoretical collection of design patterns. It should be a small, realistic vertical slice that demonstrates how good architecture works in practice.

A good reference application should show:

- How to structure code by responsibility.
- How to apply dependency injection without hidden dependencies.
- How to use interfaces at meaningful boundaries.
- How to keep domain logic independent from frameworks.
- How to document classes, methods, modules, and architectural decisions.
- How to test business rules without a database or web server.
- How to replace external integrations such as payment providers, task systems, identity providers, or connectors.
- How to keep quality high over time through CI/CD, static analysis, and review checklists.

The repository should teach not only how to write good code, but how to keep good code good over multiple years.

---

## 2. Recommended Architecture Style

Use a **Clean Architecture / Hexagonal Architecture / Ports-and-Adapters** style.

The main idea is that dependencies point inward:

```text
Framework / UI / Database / APIs
        ↓
Adapters / Infrastructure
        ↓
Application / Use Cases
        ↓
Domain
```

The domain and application layers should not depend on Spring, React, databases, HTTP, Stripe, Mollie, OpenProject, Keycloak, EDC, or other external technologies.

### Dependency Rule

- Domain does not depend on application, infrastructure, web, persistence, or frameworks.
- Application depends on domain and on abstract ports.
- Adapters implement ports and translate between external systems and application concepts.
- Framework configuration wires concrete implementations together.

---

## 3. Suggested Repository Structure

### Java / Spring Boot Example

```text
src/main/java/com/example/reference
  /domain
    /model
    /service
    /event
    /exception
    /policy

  /application
    /usecase
    /command
    /query
    /port/in
    /port/out
    /dto

  /adapter
    /in/web
    /out/persistence
    /out/payment
    /out/email
    /out/taskmanagement
    /out/identity

  /config

src/test/java/com/example/reference
  /domain
  /application
  /adapter
  /integration
```

### TypeScript / Node Example

```text
src
  /domain
    /model
    /service
    /event
    /exception
    /policy

  /application
    /usecase
    /command
    /query
    /port

  /adapters
    /inbound/http
    /outbound/persistence
    /outbound/payment
    /outbound/task-management
    /outbound/identity

  /infrastructure
  /config

tests
  /unit
  /integration
  /contract
  /e2e
```

The exact folder names are less important than the dependency direction and clear separation of responsibilities.

---

## 4. Recommended Vertical Slice

Use one realistic end-to-end workflow instead of isolated toy examples.

Recommended workflow:

```text
Admin creates an offer
Admin publishes the offer
Customer purchases the offer
Payment provider confirms payment
System creates a ticket
Staff validates the ticket
System prevents invalid reuse
System records audit event
```

This single workflow demonstrates:

- Domain modeling
- Value objects
- Business rules
- Dependency injection
- Repository ports
- External service adapters
- Web/API adapters
- Error handling
- Security boundary
- Observability
- Testing strategy
- Documentation conventions

---

## 5. Core Domain Model

Use a domain with real rules, not generic CRUD.

Example domain concepts:

```text
Offer
Plan
Membership
Ticket
Purchase
Payment
CheckIn
Customer
StaffUser
AuditEvent
```

Example business questions:

- Can this ticket be used twice?
- When does the ticket expire?
- Can a draft offer be purchased?
- What happens if the payment provider confirms payment twice?
- What happens if payment is pending?
- Can a staff member validate a ticket without permission?
- What happens when an external provider fails?

Good architecture becomes valuable when these rules are explicit and testable.

---

## 6. Domain Layer

The domain layer contains the core business concepts and rules.

It should include:

- Entities
- Value objects
- Domain services
- Domain events
- Policies/specifications
- Domain exceptions

It should not include:

- Spring annotations
- HTTP concepts
- Database annotations
- JSON serialization concerns
- Payment provider SDKs
- External API clients
- Framework-specific security classes

### Example Domain Entity

```java
public final class Ticket {

    private final TicketId id;
    private final OfferId offerId;
    private final CustomerId customerId;
    private final ValidityPeriod validityPeriod;
    private TicketStatus status;
    private int usedCount;

    public Ticket(
        TicketId id,
        OfferId offerId,
        CustomerId customerId,
        ValidityPeriod validityPeriod
    ) {
        this.id = Objects.requireNonNull(id);
        this.offerId = Objects.requireNonNull(offerId);
        this.customerId = Objects.requireNonNull(customerId);
        this.validityPeriod = Objects.requireNonNull(validityPeriod);
        this.status = TicketStatus.ACTIVE;
        this.usedCount = 0;
    }

    public TicketValidated validateAt(Instant validationTime) {
        if (status != TicketStatus.ACTIVE) {
            throw new TicketNotActiveException(id);
        }
        if (!validityPeriod.contains(validationTime)) {
            throw new TicketExpiredException(id);
        }
        if (usedCount >= 1) {
            throw new TicketAlreadyUsedException(id);
        }

        usedCount++;
        status = TicketStatus.USED;

        return new TicketValidated(id, validationTime);
    }
}
```

The business rule is inside the domain object, not in the controller or persistence layer.

---

## 7. Application Layer

The application layer orchestrates use cases. It coordinates repositories, ports, transactions, authorization checks, and domain objects.

It should include:

- Use cases
- Commands
- Queries
- Input ports
- Output ports
- Application-level exceptions
- Transaction boundaries

It should not contain provider-specific logic such as Stripe API calls or OpenProject JSON payload construction.

### Prefer Explicit Use Cases

Avoid vague service names:

```text
OfferService
TicketService
PaymentService
```

Prefer explicit use cases:

```text
CreateOfferUseCase
PublishOfferUseCase
PurchaseTicketUseCase
ValidateTicketUseCase
HandlePaymentWebhookUseCase
CancelMembershipUseCase
```

This makes the system easier to understand and easier to test.

### Example Application Use Case

```java
public final class ValidateTicketUseCase {

    private final TicketRepository ticketRepository;
    private final CurrentUserProvider currentUserProvider;
    private final Clock clock;
    private final AuditLogPort auditLogPort;

    public ValidateTicketUseCase(
        TicketRepository ticketRepository,
        CurrentUserProvider currentUserProvider,
        Clock clock,
        AuditLogPort auditLogPort
    ) {
        this.ticketRepository = ticketRepository;
        this.currentUserProvider = currentUserProvider;
        this.clock = clock;
        this.auditLogPort = auditLogPort;
    }

    public void validate(ValidateTicketCommand command) {
        CurrentUser user = currentUserProvider.currentUser();
        user.requirePermission(Permission.VALIDATE_TICKET);

        Ticket ticket = ticketRepository.findById(command.ticketId())
            .orElseThrow(() -> new TicketNotFoundException(command.ticketId()));

        TicketValidated event = ticket.validateAt(clock.instant());

        ticketRepository.save(ticket);
        auditLogPort.record(AuditEvent.from(event, user));
    }
}
```

The use case coordinates the workflow. The domain enforces the business rule.

---

## 8. Ports and Adapters

Use interfaces at architectural boundaries, not everywhere.

Good ports:

```java
public interface TicketRepository {
    Optional<Ticket> findById(TicketId id);
    void save(Ticket ticket);
}

public interface PaymentProvider {
    CheckoutSession createCheckoutSession(CreatePaymentRequest request);
}

public interface TaskManagementPort {
    TaskReference createFollowUpTask(CreateTaskCommand command);
}

public interface CurrentUserProvider {
    CurrentUser currentUser();
}

public interface AuditLogPort {
    void record(AuditEvent event);
}
```

Avoid creating interfaces for every class just because it is technically possible.

Bad pattern:

```text
OfferService
OfferServiceImpl
TicketService
TicketServiceImpl
CustomerService
CustomerServiceImpl
```

Create interfaces when:

- The implementation is external or replaceable.
- The dependency crosses an architectural boundary.
- The interface improves testability.
- Different implementations are expected, for example Stripe and Mollie.

Do not create interfaces only to satisfy a habit.

---

## 9. Dependency Injection

Use constructor injection. Avoid field injection, static service access, and hidden dependencies.

### Good

```java
public final class PurchaseTicketUseCase {

    private final OfferRepository offerRepository;
    private final PaymentProvider paymentProvider;
    private final Clock clock;

    public PurchaseTicketUseCase(
        OfferRepository offerRepository,
        PaymentProvider paymentProvider,
        Clock clock
    ) {
        this.offerRepository = offerRepository;
        this.paymentProvider = paymentProvider;
        this.clock = clock;
    }
}
```

### Avoid

```java
@Autowired
private OfferRepository offerRepository;
```

### Dependency Injection Rules

- Dependencies must be explicit in constructors.
- Business classes should not create their own infrastructure dependencies.
- Framework configuration should wire implementations.
- Tests should replace adapters with fakes, stubs, or test implementations.
- Avoid service locators and global registries.

---

## 10. Constants, Enums, and Configuration

Do not create a giant `Constants` class.

### Avoid

```java
public final class Constants {
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final int MAX_DAYS = 30;
}
```

This becomes a dumping ground and hides meaning.

### Prefer Enums for Closed Sets

```java
public enum OfferStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
}
```

### Prefer Value Objects for Meaningful Values

```java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currency);

        if (amount.signum() < 0) {
            throw new IllegalArgumentException("Amount must not be negative");
        }
    }
}
```

### Prefer Domain Policies for Business Rules

```java
public final class PunchCardPolicy {

    private static final int INCLUDED_VISITS = 11;

    public boolean isFullyUsed(PunchCard card) {
        return card.usedVisits() >= INCLUDED_VISITS;
    }
}
```

### Prefer Configuration for Environment-Specific Values

```yaml
payment:
  provider: stripe
  webhook-timeout-seconds: 10
```

### Rule of Thumb

Constants should live close to the concept they belong to.

---

## 11. Value Objects

Value objects make enterprise code more robust by replacing primitive obsession with meaningful types.

Avoid passing raw primitives everywhere:

```java
String offerId
String customerId
BigDecimal price
String currency
int duration
String email
```

Prefer meaningful types:

```java
OfferId
CustomerId
Money
ValidityPeriod
EmailAddress
TicketCode
```

Example:

```java
public record EmailAddress(String value) {
    public EmailAddress {
        Objects.requireNonNull(value);
        if (!value.matches("^[^@]+@[^@]+\\.[^@]+$")) {
            throw new IllegalArgumentException("Invalid email address");
        }
    }
}
```

Benefits:

- Fewer accidental parameter swaps.
- Validation is centralized.
- Business meaning is visible in method signatures.
- Tests become clearer.
- Invalid state is harder to represent.

---

## 12. Error Handling

Use a consistent error model.

Categories:

```text
Validation errors
Business rule violations
Not found errors
Authorization errors
External system errors
Concurrency errors
Configuration errors
```

### Domain Exception Example

```java
public final class TicketAlreadyUsedException extends BusinessRuleViolation {
    public TicketAlreadyUsedException(TicketId ticketId) {
        super("Ticket has already been used: " + ticketId.value());
    }
}
```

### Central API Error Mapping

```java
@RestControllerAdvice
public final class ApiExceptionHandler {

    @ExceptionHandler(BusinessRuleViolation.class)
    ResponseEntity<ApiError> handleBusinessRuleViolation(BusinessRuleViolation exception) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ApiError.from(exception));
    }
}
```

Rules:

- Do not throw random runtime exceptions from everywhere.
- Domain errors should express business meaning.
- API error responses should be consistent.
- External provider errors should be translated at adapter boundaries.
- Logs should include correlation IDs but not secrets or sensitive data.

---

## 13. Security Boundary

Security should be visible in the architecture.

Include:

- Authentication abstraction
- Authorization checks in use cases or policies
- Role and permission model
- Input validation
- Sensitive log masking
- Webhook signature validation
- Output filtering
- Secure configuration and secret handling

### Example Current User Port

```java
public interface CurrentUserProvider {
    CurrentUser currentUser();
}
```

### Example Permission Check

```java
public final class CurrentUser {

    private final UserId id;
    private final Set<Permission> permissions;

    public void requirePermission(Permission permission) {
        if (!permissions.contains(permission)) {
            throw new AccessDeniedException(permission);
        }
    }
}
```

The application layer can enforce permissions without depending directly on Spring Security, Keycloak, or another identity provider.

---

## 14. Persistence

Persistence should be an adapter, not the center of the design.

Avoid putting business rules into JPA entities or database callbacks.

Recommended approach:

```text
Domain model
  ↕ mapping
Persistence entity
  ↕ repository adapter
Database
```

### Persistence Adapter Example

```java
@Repository
public final class JpaTicketRepository implements TicketRepository {

    private final SpringDataTicketRepository repository;
    private final TicketMapper mapper;

    public JpaTicketRepository(
        SpringDataTicketRepository repository,
        TicketMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Ticket> findById(TicketId id) {
        return repository.findById(id.value()).map(mapper::toDomain);
    }

    @Override
    public void save(Ticket ticket) {
        repository.save(mapper.toEntity(ticket));
    }
}
```

Rules:

- Domain objects should not be shaped only by database convenience.
- Persistence models may differ from domain models.
- Use optimistic locking where concurrent updates matter.
- Make idempotency explicit for webhook/event handling.

---

## 15. External Integrations

External integrations should be replaceable adapters.

Examples:

```text
Stripe / Mollie
OpenProject / Jira / GitLab Issues
Keycloak / local identity provider
Email provider
File storage
EDC connector
Message broker
```

### Payment Provider Port

```java
public interface PaymentProvider {
    CheckoutSession createCheckoutSession(CreatePaymentRequest request);
    VerifiedWebhook verifyWebhook(String payload, String signatureHeader);
}
```

### Stripe Adapter

```java
public final class StripePaymentAdapter implements PaymentProvider {

    private final StripeClient stripeClient;
    private final StripeWebhookVerifier webhookVerifier;

    @Override
    public CheckoutSession createCheckoutSession(CreatePaymentRequest request) {
        // Translate application request into Stripe-specific API call.
    }

    @Override
    public VerifiedWebhook verifyWebhook(String payload, String signatureHeader) {
        // Verify Stripe signature and translate event into application concept.
    }
}
```

Rules:

- External SDKs stay in adapters.
- Application layer speaks in application concepts.
- Provider-specific exceptions are translated at the boundary.
- Webhooks must be idempotent.
- Raw request bodies may be required for signature verification.

---

## 16. Observability and Auditability

Enterprise-grade code should include observability from the beginning.

Include:

```text
Structured logging
Correlation IDs
Metrics
Health checks
Audit events
Domain events
Technical events
```

Distinguish:

| Type | Purpose | Example |
|---|---|---|
| Domain event | Business fact | `TicketValidated` |
| Audit event | Who did what and when | `StaffUser X validated Ticket Y` |
| Technical log | Runtime diagnostics | `Payment webhook processed` |
| Metric | Operational measurement | `ticket_validation_success_total` |
| Health check | System readiness | `database reachable`, `payment provider configured` |

Rules:

- Do not log secrets, tokens, passwords, payment details, or personal data unnecessarily.
- Include correlation IDs in logs and error responses.
- Make operational problems diagnosable without exposing sensitive data.
- Audit business-critical actions.

---

## 17. Testing Strategy

The architecture should make testing easy.

Test levels:

```text
Domain tests
Application use-case tests
Adapter tests
Integration tests
Contract tests
End-to-end smoke tests
```

### Domain Test Example

```java
class TicketTest {

    @Test
    void cannotValidateTicketTwice() {
        Ticket ticket = activeTicket(validForToday());

        ticket.validateAt(now());

        assertThrows(
            TicketAlreadyUsedException.class,
            () -> ticket.validateAt(now())
        );
    }
}
```

### Application Test Example

```java
class ValidateTicketUseCaseTest {

    @Test
    void recordsAuditEventAfterSuccessfulValidation() {
        FakeTicketRepository tickets = new FakeTicketRepository();
        FakeAuditLog auditLog = new FakeAuditLog();
        FixedClock clock = FixedClock.at("2026-04-25T10:00:00Z");

        ValidateTicketUseCase useCase = new ValidateTicketUseCase(
            tickets,
            staffUserWithPermission(),
            clock,
            auditLog
        );

        useCase.validate(new ValidateTicketCommand(existingTicketId()));

        assertThat(auditLog.events()).hasSize(1);
    }
}
```

Rules:

- Most business logic should be testable without Spring, a database, or external services.
- Use fakes for application tests.
- Use Testcontainers or equivalent tools for real database integration tests.
- Use contract tests for provider adapters when feasible.
- Include time-based tests using an injected clock.

---

## 18. Configuration and Environments

Support clear environment separation:

```text
local
unit-test
integration-test
staging
production
```

Include:

- Application config
- Secrets via environment variables or secret manager
- Docker Compose for local dependencies
- Testcontainers for integration tests
- Separate profiles for local/test/prod behavior
- Explicit startup validation for required configuration

Rules:

- No hardcoded secrets.
- No hardcoded production URLs.
- No hidden local machine assumptions.
- Fail fast when required configuration is missing.

---

## 19. CI/CD Quality Gates

A reference repository should show how quality is maintained continuously.

Recommended pipeline stages:

```text
format
lint
compile
unit-test
integration-test
static-analysis
security-scan
dependency-scan
secret-detection
build-image
publish-artifacts
```

For GitLab, useful reports include:

```text
artifacts:reports:codequality
artifacts:reports:sast
artifacts:reports:secret_detection
```

Quality gates should include:

- Tests must pass.
- Formatting must pass.
- Linting must pass.
- Static analysis must not contain critical findings.
- No secrets may be committed.
- Build artifacts must be reproducible.
- Dependency vulnerabilities must be visible.

---

## 20. Documentation Strategy

Documentation should be treated as part of the codebase, not as a separate afterthought.

Use documentation at different levels:

```text
README.md                         Quick orientation
/docs/architecture-overview.md     System architecture
/docs/module-boundaries.md         Module responsibilities and dependency rules
/docs/testing-strategy.md          Test levels and examples
/docs/coding-guidelines.md         Team coding conventions
/docs/error-handling.md            Error model and API responses
/docs/security.md                  Auth, permissions, secrets, threat model
/docs/observability.md             Logging, metrics, tracing, auditing
/docs/decisions/*.md               Architecture Decision Records
Code-level docs                    Public APIs, domain concepts, tricky decisions
```

### Recommended Documentation Principle

Document **why**, **what contract**, and **what constraints**. Do not document obvious implementation details.

Bad:

```java
// Increment used count by one.
usedCount++;
```

Good:

```java
// A day ticket becomes consumed after the first successful validation.
// Re-entry is represented by a separate ReEntryPermission, not by reusing the ticket.
usedCount++;
```

---

## 21. Code and Class Documentation Template

Use class and method documentation intentionally. Not every method needs a long comment. Public APIs, domain concepts, extension points, and non-obvious rules should be documented.

### When to Document a Class

Document a class when it is:

- Part of a public API or module boundary.
- A domain concept with business meaning.
- A use case that coordinates important behavior.
- A port that adapter implementations must follow.
- A policy/specification that encodes business rules.
- An adapter with non-obvious external constraints.
- Security-, payment-, audit-, or compliance-relevant.

### When Not to Document a Class

Avoid boilerplate comments for obvious classes.

Bad:

```java
/**
 * Service for offers.
 */
public final class OfferService {
}
```

This adds noise without helping maintenance.

### Recommended Class Documentation Structure

Use this structure for important classes:

```java
/**
 * Short one-sentence summary of the responsibility of this class.
 *
 * <p>Business context: Explain the domain concept or workflow this class belongs to.
 *
 * <p>Invariants and rules: Document the rules this class protects.
 *
 * <p>Collaboration: Mention important ports, adapters, or events if relevant.
 *
 * <p>Thread-safety / lifecycle: Document whether instances are stateless, stateful,
 * request-scoped, singleton-safe, or not thread-safe.
 */
public final class ExampleClass {
}
```

### Example: Domain Class Documentation

```java
/**
 * Represents a purchased ticket that can be validated during check-in.
 *
 * <p>A ticket is created only after a payment has been confirmed or after an
 * administrator manually grants access. The ticket protects the core business
 * rule that access may only be granted while the ticket is active and valid.
 *
 * <p>Invariants:
 * <ul>
 *   <li>A used single-entry ticket cannot be validated again.</li>
 *   <li>An expired ticket cannot be validated.</li>
 *   <li>A ticket without an active status cannot grant access.</li>
 * </ul>
 *
 * <p>This class is framework-independent and must not depend on persistence,
 * HTTP, payment providers, or authentication frameworks.
 */
public final class Ticket {
}
```

### Example: Use Case Documentation

```java
/**
 * Validates a ticket during physical check-in.
 *
 * <p>This use case coordinates authorization, ticket lookup, domain validation,
 * persistence, and audit logging. The actual business rule for whether a ticket
 * can be used is implemented by {@link Ticket}.
 *
 * <p>Required permission: {@link Permission#VALIDATE_TICKET}.
 *
 * <p>Transactional behavior: The ticket state update and audit event should be
 * committed atomically. If audit logging is implemented asynchronously, the
 * emitted domain event must be durable.
 */
public final class ValidateTicketUseCase {
}
```

### Example: Port Documentation

```java
/**
 * Stores and retrieves tickets using domain-level identifiers and objects.
 *
 * <p>This is an outbound application port. Implementations may use JPA,
 * MongoDB, files, or an external API, but callers must not depend on those
 * details.
 *
 * <p>Implementations must preserve optimistic locking semantics where supported.
 */
public interface TicketRepository {
    Optional<Ticket> findById(TicketId id);
    void save(Ticket ticket);
}
```

### Example: Adapter Documentation

```java
/**
 * Payment provider adapter for Stripe Checkout and Stripe webhooks.
 *
 * <p>This adapter translates application-level payment requests into Stripe API
 * calls and translates verified Stripe webhook events back into application
 * events.
 *
 * <p>Security: Webhook verification requires the raw HTTP request body. Do not
 * parse or modify the payload before signature verification.
 *
 * <p>Idempotency: Webhook events may be delivered more than once. The application
 * layer must treat payment confirmation as idempotent.
 */
public final class StripePaymentAdapter implements PaymentProvider {
}
```

---

## 22. Method Documentation Template

Document public methods when they represent a contract, rule, extension point, or non-obvious behavior.

### Recommended Method Documentation Structure

```java
/**
 * One-sentence summary of what the method does.
 *
 * <p>Explain important business semantics, side effects, idempotency,
 * transactional expectations, or security implications.
 *
 * @param command describes the requested operation; must contain a valid ticket id
 * @throws TicketNotFoundException if no ticket exists for the given id
 * @throws AccessDeniedException if the current user lacks the required permission
 */
public void validate(ValidateTicketCommand command) {
}
```

### Good Method Documentation Example

```java
/**
 * Confirms a payment and creates the purchased ticket if needed.
 *
 * <p>This method is idempotent because payment webhooks may be delivered more
 * than once by the provider. Re-processing the same provider event must not
 * create duplicate tickets.
 *
 * @param command verified payment confirmation from a payment provider
 * @throws PurchaseNotFoundException if the referenced purchase does not exist
 */
public void confirmPayment(ConfirmPaymentCommand command) {
}
```

### Poor Method Documentation Example

```java
/**
 * Saves ticket.
 */
void save(Ticket ticket);
```

This is too obvious to be useful.

---

## 23. Inline Comments

Inline comments should explain intent, constraints, trade-offs, or surprising decisions.

Use inline comments for:

- Non-obvious business rules.
- Workarounds for external systems.
- Security-sensitive code.
- Time/date edge cases.
- Concurrency or idempotency concerns.
- Complex algorithms.

Avoid inline comments that repeat the code.

### Bad

```java
// Set status to used.
status = TicketStatus.USED;
```

### Good

```java
// Mark the ticket as used before publishing the event so that a retry cannot
// validate the same single-entry ticket twice.
status = TicketStatus.USED;
```

---

## 24. Documentation for Interfaces and Extension Points

Interfaces need stronger documentation than normal classes because other developers implement them.

Each port/interface should document:

- Responsibility
- Expected behavior
- Idempotency
- Error expectations
- Nullability
- Concurrency assumptions
- Security implications
- Whether implementations may call external systems

### Interface Documentation Template

```java
/**
 * Short summary of what this port abstracts.
 *
 * <p>Implementations must ...
 *
 * <p>Callers may assume ...
 *
 * <p>Implementations should throw ... for ...
 *
 * <p>Thread-safety: Implementations are expected to be safe for singleton use
 * unless documented otherwise.
 */
public interface SomePort {
}
```

---

## 25. Documentation for Value Objects

Value object documentation should describe meaning, validation rules, and units.

```java
/**
 * Monetary amount in a specific ISO 4217 currency.
 *
 * <p>The amount is stored as a decimal value and must not be negative. Currency
 * conversion is deliberately not performed by this value object.
 */
public record Money(BigDecimal amount, Currency currency) {
}
```

For time-related values, always document units and boundary semantics.

```java
/**
 * Closed-open validity interval for a ticket.
 *
 * <p>The start instant is inclusive. The end instant is exclusive. This avoids
 * ambiguity when one validity period ends exactly when another begins.
 */
public record ValidityPeriod(Instant validFrom, Instant validUntil) {
}
```

---

## 26. Documentation for Deprecated Code

Deprecation must include a migration path.

```java
/**
 * Creates a checkout session using the legacy payment flow.
 *
 * @deprecated Use {@link CreateCheckoutSessionUseCase} instead. This method will
 * be removed after all tenants have migrated to provider-mapped offers.
 */
@Deprecated(forRemoval = true)
public CheckoutSession createLegacySession(LegacyCheckoutRequest request) {
}
```

Rules:

- Explain what replaces it.
- Explain why it is deprecated.
- Explain when removal is expected, if known.
- Do not leave deprecated code without ownership.

---

## 27. Language-Specific Documentation Standards

### Java

Use Javadoc for public APIs, domain concepts, ports, adapters, use cases, and non-obvious business rules.

Recommended tags:

```text
@param
@return
@throws
@deprecated
@see
{@link SomeClass}
```

Guidelines:

- Start with a concise summary sentence.
- Explain business meaning, not just mechanics.
- Use `@throws` for meaningful contract exceptions.
- Use `@link` for important domain concepts.
- Avoid boilerplate comments for obvious getters/setters.
- Keep domain Javadocs free from framework-specific details unless documenting an adapter.

### TypeScript

Use TSDoc/JSDoc-style comments for public APIs, exported classes, exported functions, interfaces, and extension points.

Example:

```ts
/**
 * Validates a ticket during check-in.
 *
 * @remarks
 * This use case is responsible for authorization, loading the ticket,
 * applying the domain validation rule, and recording an audit event.
 *
 * @throws {@link TicketAlreadyUsedError}
 * Thrown when a single-entry ticket has already been consumed.
 */
export class ValidateTicketUseCase {
}
```

Guidelines:

- Document exported APIs more carefully than private functions.
- Use `@remarks` for business context.
- Use `@throws` for relevant error behavior.
- Use `@deprecated` with a migration path.
- Avoid comments that simply repeat type signatures.

### C#

Use XML documentation comments for public APIs.

Example:

```csharp
/// <summary>
/// Validates a ticket during physical check-in.
/// </summary>
/// <remarks>
/// Coordinates authorization, ticket lookup, domain validation, persistence,
/// and audit logging. The ticket entity owns the validation rule itself.
/// </remarks>
/// <param name="command">The validation request.</param>
/// <exception cref="TicketAlreadyUsedException">
/// Thrown when a single-entry ticket has already been consumed.
/// </exception>
public void Validate(ValidateTicketCommand command)
{
}
```

---

## 28. Documentation Quality Checklist

Use this checklist during code review.

### Class Documentation

- [ ] Does the comment explain responsibility clearly?
- [ ] Does it describe business context where helpful?
- [ ] Does it document invariants or important rules?
- [ ] Does it avoid repeating obvious implementation details?
- [ ] Does it mention lifecycle or thread-safety where relevant?
- [ ] Does it avoid framework details in domain classes?

### Method Documentation

- [ ] Does the method documentation describe the contract?
- [ ] Are parameters explained only when meaning is not obvious?
- [ ] Are important exceptions documented?
- [ ] Are side effects documented?
- [ ] Is idempotency documented for webhook/event processing?
- [ ] Is transactional behavior documented where important?

### Interface / Port Documentation

- [ ] Does the interface explain what it abstracts?
- [ ] Are implementation obligations clear?
- [ ] Are nullability and error expectations clear?
- [ ] Are concurrency and idempotency expectations clear?
- [ ] Is the documentation independent of one specific implementation?

### Inline Comments

- [ ] Do comments explain why, not what?
- [ ] Are workarounds linked to an issue or ADR when useful?
- [ ] Are security-sensitive decisions explained?
- [ ] Are stale comments removed?

---

## 29. Architecture Documentation

Use lightweight architecture documentation that lives in the repository.

Recommended `/docs` structure:

```text
docs/
  architecture-overview.md
  context-and-scope.md
  building-block-view.md
  runtime-view.md
  deployment-view.md
  cross-cutting-concepts.md
  quality-requirements.md
  risks-and-technical-debt.md
  glossary.md
  decisions/
    0001-use-hexagonal-architecture.md
    0002-use-constructor-injection.md
    0003-keep-domain-free-of-frameworks.md
    0004-use-adrs-for-architecture-decisions.md
```

### Architecture Overview Template

```markdown
# Architecture Overview

## Purpose

What problem does the system solve?

## Quality Goals

- Maintainability
- Testability
- Replaceability of external systems
- Security
- Observability

## Context

Which users and external systems interact with the application?

## Main Building Blocks

Describe domain, application, adapters, infrastructure, and UI/API.

## Dependency Rules

Which modules may depend on which other modules?

## Runtime View

Describe the most important workflows.

## Deployment View

Describe services, databases, queues, identity providers, and external systems.

## Risks and Technical Debt

What should future maintainers watch carefully?
```

---

## 30. Architecture Decision Records

Use ADRs to document significant technical decisions.

ADRs are especially useful when a decision affects long-term maintainability, dependencies, security, deployment, module boundaries, or team workflows.

### ADR Template

```markdown
# ADR-0001: Use Hexagonal Architecture

## Status

Accepted

## Context

We need a structure that keeps business logic independent from frameworks,
databases, and external services. The application is expected to live for many
years and integrate with changing providers.

## Decision

We will use a hexagonal architecture with domain and application logic in the
center, and inbound/outbound adapters at the edges.

## Consequences

Positive:

- Business rules can be tested without infrastructure.
- External systems can be replaced through adapters.
- Dependencies are easier to understand.

Negative:

- More initial structure than a simple CRUD application.
- Developers need to understand the dependency rule.

## Alternatives Considered

- Traditional layered architecture
- Framework-centric CRUD architecture
- Microservice-first design
```

Rules:

- One ADR per significant decision.
- Keep ADRs short.
- Include consequences and alternatives.
- Do not rewrite history; supersede old ADRs with new ones.
- Link ADRs from relevant code comments when helpful.

---

## 31. README Template

```markdown
# Enterprise Reference Architecture

This repository demonstrates maintainable enterprise-grade application
architecture using Clean Architecture / Hexagonal Architecture principles.

## Goals

- Long-term maintainability
- Testability
- Framework independence
- Clear module boundaries
- Replaceable infrastructure
- Explicit business rules
- Secure and observable operations

## Example Workflow

Admin creates an offer, publishes it, a customer purchases it, payment is
confirmed, a ticket is created, and staff validates the ticket.

## Architecture

The system is structured into domain, application, adapters, and configuration.
Dependencies point inward.

## Run Locally

```bash
./gradlew bootRun
```

## Run Tests

```bash
./gradlew test
```

## Documentation

See `/docs` for architecture overview, module boundaries, testing strategy,
coding guidelines, and architecture decision records.
```

---

## 32. Code Review Checklist

### Architecture

- [ ] Does the code respect the dependency rule?
- [ ] Is business logic kept out of controllers?
- [ ] Is business logic kept out of persistence entities?
- [ ] Are external systems hidden behind ports?
- [ ] Are interfaces used at meaningful boundaries only?
- [ ] Are use cases explicit and understandable?

### OOP Design

- [ ] Are domain concepts modeled explicitly?
- [ ] Are value objects used instead of primitive obsession?
- [ ] Are invariants protected by constructors or methods?
- [ ] Are classes cohesive?
- [ ] Are responsibilities clear?
- [ ] Is inheritance avoided unless it adds clear value?

### Dependency Injection

- [ ] Are dependencies constructor-injected?
- [ ] Are there no hidden static dependencies?
- [ ] Can use cases be tested with fake adapters?
- [ ] Is configuration isolated from business logic?

### Constants and Configuration

- [ ] Are magic values named?
- [ ] Are constants close to the concepts they belong to?
- [ ] Are environment-specific values in configuration?
- [ ] Are enums used for closed sets?
- [ ] Are business constants represented as policies when appropriate?

### Error Handling

- [ ] Are business rule violations explicit?
- [ ] Are external errors translated at boundaries?
- [ ] Are API errors consistent?
- [ ] Are security errors handled safely?
- [ ] Are logs useful without leaking sensitive data?

### Tests

- [ ] Are business rules covered by domain tests?
- [ ] Are use cases tested without infrastructure?
- [ ] Are adapter integrations tested separately?
- [ ] Are time-based cases tested with an injected clock?
- [ ] Are idempotency and concurrency cases covered?

### Documentation

- [ ] Are important classes documented?
- [ ] Are ports and extension points documented clearly?
- [ ] Are non-obvious business rules documented?
- [ ] Are ADRs created for significant architectural choices?
- [ ] Are comments useful and current?

---

## 33. Common Anti-Patterns to Avoid

Avoid:

```text
Too many interfaces without purpose
Anemic domain model
Generic BaseService/BaseRepository inheritance
Huge Utils or Constants classes
Business logic in controllers
Business logic in database entities
Framework annotations in the domain layer
Overengineered DDD terminology
Abstracting things that will never change
No realistic external integration
No tests showing why the architecture matters
No documentation for extension points
Comments that repeat obvious code
Outdated documentation that contradicts the code
```

---

## 34. Suggested Minimum Reference Implementation

The reference implementation should include:

```text
1. Domain model
2. Application use cases
3. Ports and adapters
4. REST API adapter
5. Persistence adapter
6. Payment provider adapter
7. Authentication/authorization abstraction
8. Configuration
9. Error handling
10. Observability
11. Domain tests
12. Application tests
13. Adapter/integration tests
14. CI pipeline
15. README
16. Architecture documentation
17. ADRs
18. Coding and documentation guidelines
```

Recommended first workflow:

```text
Create offer
Publish offer
Purchase offer
Confirm payment
Create ticket
Validate ticket
Prevent duplicate validation
Record audit event
```

---

## 35. External References

These references can be used as starting points for team conventions and documentation templates.

### Code Documentation

- Oracle: *How to Write Doc Comments for the Javadoc Tool*  
  https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html

- Google Java Style Guide: Javadoc and comments  
  https://google.github.io/styleguide/javaguide.html

- TSDoc: TypeScript documentation comment standard  
  https://tsdoc.org/

- TypeScript Handbook: JSDoc-supported types and tags  
  https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

- Microsoft: XML documentation comments for C#  
  https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/xmldoc/

- Microsoft: Recommended XML documentation tags for C#  
  https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/xmldoc/recommended-tags

### Architecture Documentation

- arc42: Software architecture documentation template  
  https://arc42.org/

- arc42 Documentation  
  https://docs.arc42.org/home/

- Michael Nygard: Documenting Architecture Decisions  
  https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions

- MADR: Markdown Architectural Decision Records  
  https://adr.github.io/madr/

- Microsoft Azure Well-Architected Framework: Architecture Decision Records  
  https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record

---

## 36. Final Principle

Do not build the reference architecture to impress architects. Build it so that a new developer can join the project, understand the system quickly, make a safe change, and know where business rules, integration code, tests, and documentation belong.

A good architecture is not the one with the most layers. It is the one where change is cheap, behavior is explicit, and the important decisions are still understandable years later.
