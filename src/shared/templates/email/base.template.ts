import { env } from "@/infrastructure/config/env.config";
import mjml2html from "mjml";
import { emailTheme } from "./theme.config";

export interface EmailTemplateResult {
  subject: string;
  html: string;
}

export abstract class EmailTemplate {
  protected buildUrl(path: string, params: Record<string, string>): string {
    // Use the first allowed origin as the frontend URL
    const frontendUrl = env.allowedOrigins[0];
    const url = new URL(path, frontendUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  protected baseTemplate(content: string): string {
    const theme = emailTheme;

    return mjml2html(`
      <mjml>
        <mj-head>
          <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto" />
          <mj-attributes>
            <mj-all font-family="Roboto, Helvetica, sans-serif" />
          </mj-attributes>
        </mj-head>
        <mj-body background-color="#f4f4f4">
          <mj-section background-color="#ffffff" padding="20px 0">
            <mj-column>
              ${content}
            </mj-column>
          </mj-section>
          <mj-section background-color="#f4f4f4" padding="20px 0">
            <mj-column>
              <mj-text font-size="12px" color="#666666" align="center">
                © ${new Date().getFullYear()} ${
      env.vars.APP_NAME
    }. Todos los derechos reservados.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `).html;
  }

  abstract generate(...args: any[]): EmailTemplateResult;
}
