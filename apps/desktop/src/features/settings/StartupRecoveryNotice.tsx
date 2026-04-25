import React from "react";

type Props = {
  code: string;
  message: string;
};

export function StartupRecoveryNotice({ code, message }: Props): JSX.Element {
  return (
    <div role="alert" aria-label="startup-recovery-notice">
      <strong>{code}</strong>
      <p>{message}</p>
    </div>
  );
}
