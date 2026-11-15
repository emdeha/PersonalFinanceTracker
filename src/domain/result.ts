export type Accepted<TValue> = {
  readonly ok: true;
  readonly value: TValue;
};

export type Refused<TReason> = {
  readonly ok: false;
  readonly reason: TReason;
};

export type Result<TValue, TReason> = Accepted<TValue> | Refused<TReason>;

export const accepted = <TValue>(value: TValue): Accepted<TValue> => ({
  ok: true,
  value,
});

export const refused = <TReason>(reason: TReason): Refused<TReason> => ({
  ok: false,
  reason,
});

export const reasonsIn = <TReason>(
  results: readonly Result<unknown, TReason>[],
): readonly TReason[] =>
  results.flatMap((result) => (result.ok ? [] : [result.reason]));
