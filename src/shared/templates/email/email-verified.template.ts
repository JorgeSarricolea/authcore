import { EmailTemplate, EmailTemplateResult } from "./base.template";
import { emailTheme } from "./theme.config";
import { env } from "@/infrastructure/config/env.config";

export class EmailVerifiedTemplate extends EmailTemplate {
  generate(): EmailTemplateResult {
    const theme = emailTheme;

    const content = `
      <mj-section padding-bottom="${theme.spacing.normal}">
        <mj-column>
          <mj-text font-size="${
  theme.typography.fontSize.large
}" font-weight="bold" align="center" color="${
  theme.colors.primary.main
}">
            ¡Correo electrónico verificado!
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.normal}">
            Tu correo electrónico ha sido verificado exitosamente.
          </mj-text>
          <mj-text align="center" padding-top="${theme.spacing.normal}">
            Ahora puedes disfrutar de todas las funcionalidades de ${
  env.appName
}.
          </mj-text>
          <mj-button href="${this.buildUrl("/login", {})}" 
            align="center" 
            padding="${theme.spacing.normal}"
            background-color="${theme.colors.primary.main}"
            color="${theme.colors.text.onPrimary}">
            Iniciar sesión
          </mj-button>
          <mj-text align="center" color="${
  theme.colors.text.secondary
}" font-size="${theme.typography.fontSize.small}" padding-top="${
  theme.spacing.normal
}">
            Si no solicitaste esta verificación, por favor contacta a soporte.
          </mj-text>
        </mj-column>
      </mj-section>
    `;

    return {
      subject: "Correo electrónico verificado",
      html: this.baseTemplate(content),
    };
  }
}

export const emailVerifiedTemplate = new EmailVerifiedTemplate();
