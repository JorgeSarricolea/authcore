import { EmailTemplate, EmailTemplateResult } from "./base.template";
import { emailTheme } from "./theme.config";
import { env } from "@/infrastructure/config/env.config";

interface VerificationData {
  code: string;
  email: string;
}

export class VerificationEmailTemplate extends EmailTemplate {
  generate(data: VerificationData): EmailTemplateResult {
    const theme = emailTheme;

    const content = `
      <mj-section padding-bottom="${theme.spacing.normal}">
        <mj-column>
          <mj-text font-size="${
            theme.typography.fontSize.large
          }" font-weight="bold" align="center" color="${
      theme.colors.primary.main
    }">
            ¡Bienvenido a ${env.appName}!
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.normal}">
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
            Haz clic en el botón para verificar tu correo electrónico:
          </mj-text>
          <mj-button href="${this.buildUrl("/verify-email", {
            code: data.code,
            email: data.email,
          })}" align="center" padding="${theme.spacing.normal}">
            Verificar correo electrónico
          </mj-button>
          <mj-text align="center" color="${
            theme.colors.text.secondary
          }" font-size="${theme.typography.fontSize.small}" padding-top="${
      theme.spacing.normal
    }">
            Este código expirará en 60 minutos.
          </mj-text>
        </mj-column>
      </mj-section>
    `;

    return {
      subject: "Verifica tu correo electrónico",
      html: this.baseTemplate(content),
    };
  }
}

export const verificationTemplate = new VerificationEmailTemplate();
