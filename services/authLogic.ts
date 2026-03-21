export type LoginForm = {
  email: string;
  password: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function buildLoginPayload(form: LoginForm): LoginForm {
  return {
    email: normalizeEmail(form.email),
    password: form.password,
  };
}

export function buildRegisterPayload(form: {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}) {
  return {
    name: form.name.trim(),
    email: normalizeEmail(form.email),
    password: form.password,
    role_id: form.roleId ?? 2,
  };
}

export function mapInternalError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
