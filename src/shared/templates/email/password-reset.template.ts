import { EmailTemplate, EmailTemplateResult } from "./base.template";
import { emailTheme } from "./theme.config";

interface PasswordResetData {
  code: string;
  email: string;
}

export class PasswordResetEmailTemplate extends EmailTemplate {
  generate(data: PasswordResetData): EmailTemplateResult {
    const theme = emailTheme;

    const content = `
      <mj-section padding-bottom="${theme.spacing.normal}">
        <mj-column>
          <mj-text font-size="${
  theme.typography.fontSize.large
}" font-weight="bold" align="center" color="${
  theme.colors.primary.main
}">
            Restablecimiento de contraseña
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.normal}">
            Has solicitado restablecer tu contraseña.
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.small}">
            Tu código de verificación es:
          </mj-text>
          <mj-text font-size="${
  theme.typography.fontSize.xlarge
}" font-weight="bold" align="center" color="${
  theme.colors.primary.light
}" padding="${theme.spacing.small} ${theme.spacing.large}">
            ${data.code}
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.normal}">
            Haz clic en el botón para restablecer tu contraseña:
          </mj-text>
          <mj-button href="${this.buildUrl("/reset-password", {
    code: data.code,
    email: data.email,
  })}" align="center" padding="${theme.spacing.normal}">
            Restablecer contraseña
          </mj-button>
          <mj-text align="center" color="${
  theme.colors.text.secondary
}" font-size="${theme.typography.fontSize.small}" padding-top="${
  theme.spacing.normal
}">
            Este código expirará en 1 hora.
          </mj-text>
          <mj-text align="center" color="${
  theme.colors.text.secondary
}" font-size="${theme.typography.fontSize.small}">
            Si no solicitaste este cambio, ignora este correo.
          </mj-text>
        </mj-column>
      </mj-section>
    `;

    return {
      subject: "Restablecimiento de contraseña",
      html: this.baseTemplate(content),
    };
  }
}

export class PasswordResetSuccessEmailTemplate extends EmailTemplate {
  generate(): EmailTemplateResult {
    const theme = emailTheme;

    const content = `
      <mj-section padding-bottom="${theme.spacing.normal}">
        <mj-column>
          <mj-text font-size="${theme.typography.fontSize.large}" font-weight="bold" align="center" color="${theme.colors.primary.main}">
            Contraseña actualizada
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.normal}">
            Tu contraseña ha sido actualizada exitosamente.
          </mj-text>
          <mj-text align="center" color="${theme.colors.text.secondary}" font-size="${theme.typography.fontSize.small}" padding-top="${theme.spacing.normal}">
            Si no realizaste este cambio, por favor contacta con soporte inmediatamente.
          </mj-text>
        </mj-column>
      </mj-section>
    `;

    return {
      subject: "Contraseña actualizada con éxito",
      html: this.baseTemplate(content),
    };
  }
}

export const passwordResetTemplate = new PasswordResetEmailTemplate();
export const passwordResetSuccessTemplate =
  new PasswordResetSuccessEmailTemplate();
