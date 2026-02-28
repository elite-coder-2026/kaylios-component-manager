
const base = css`
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 150ms ease, border 150ms ease, color 150ms ease, box-shadow 150ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 3px solid #93C5FD;
    outline-offset: 2px;
  }
`

export const PrimaryBtn = styled.button`
  ${base}
  background: #2563EB;
  color: #FFFFFF;

  &:hover:not(:disabled) { background: #1D4ED8; }
  &:active:not(:disabled) { background: #1E40AF; }
`

export const ErrorBtn = styled.button`
  ${base}
  background: #DC2626;
  color: #FFFFFF;

  &:hover:not(:disabled) { background: #B91C1C; }
  &:active:not(:disabled) { background: #991B1B; }
`