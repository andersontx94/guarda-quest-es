import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const VERSAO = "1.0";
const DATA_VIGENCIA = "27 de março de 2026";
const EMAIL = "suporte@guardaquest.com.br";
const CHECKOUT = "https://pay.hotmart.com/P105084825B";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
    <div className="text-sm text-muted-foreground leading-7 space-y-3">{children}</div>
  </div>
);

const TermosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/94 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">GuardaQuest</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-foreground mb-2">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground">
            Versão {VERSAO} · Vigente a partir de {DATA_VIGENCIA}
          </p>
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/15 text-sm text-foreground">
            Ao acessar ou utilizar o GuardaQuest, você concorda com estes Termos de Uso.
            Leia com atenção antes de prosseguir.
          </div>
        </div>

        <Section title="1. Sobre o GuardaQuest">
          <p>
            O <strong className="text-foreground">GuardaQuest</strong> é uma plataforma digital de preparação para
            concursos públicos, com foco no concurso da Guarda Municipal de Manaus 2026 (Consulplan).
            Oferece questões comentadas, simulados cronometrados, ranking entre candidatos e materiais em PDF.
          </p>
          <p>
            Operado por Anderson Robson Teixeira, Manaus/AM, Brasil.<br />
            Contato: <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
          </p>
        </Section>

        <Section title="2. Elegibilidade">
          <p>Para usar o GuardaQuest você deve:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ter no mínimo 18 anos de idade</li>
            <li>Ter realizado a compra do acesso através da Hotmart</li>
            <li>Fornecer informações verdadeiras no cadastro</li>
            <li>Não compartilhar sua conta com terceiros</li>
          </ul>
        </Section>

        <Section title="3. Acesso e pagamento">
          <p>
            O acesso à plataforma é <strong className="text-foreground">individual, intransferível e válido por 60 dias</strong>{" "}
            a partir da data da compra. O pagamento é processado pela Hotmart mediante pagamento único.
          </p>
          <p>
            Após confirmação do pagamento, o acesso é liberado automaticamente via e-mail com link
            para criação de senha. O e-mail usado na compra será o e-mail da conta.
          </p>
          <p>
            <strong className="text-foreground">Garantia:</strong> A Hotmart oferece garantia de reembolso
            conforme sua política. Em caso de reembolso aprovado, o acesso será revogado automaticamente.
          </p>
        </Section>

        <Section title="4. Uso permitido">
          <p>Você pode:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Acessar o conteúdo para uso pessoal de preparação para o concurso</li>
            <li>Baixar os PDFs para uso pessoal offline</li>
            <li>Participar do ranking com apelido de sua escolha</li>
          </ul>
          <p className="mt-2">É <strong className="text-foreground">proibido</strong>:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Compartilhar credenciais de acesso com terceiros</li>
            <li>Reproduzir, copiar ou distribuir o conteúdo da plataforma</li>
            <li>Usar mecanismos automatizados (bots, scrapers) para acessar o conteúdo</li>
            <li>Tentar burlar medidas de segurança ou acesso</li>
            <li>Usar a plataforma para fins comerciais sem autorização</li>
          </ul>
        </Section>

        <Section title="5. Propriedade intelectual">
          <p>
            Todo o conteúdo do GuardaQuest — questões, comentários, simulados, PDFs, design e código —
            é de propriedade exclusiva do GuardaQuest e protegido por direitos autorais (Lei nº 9.610/1998).
          </p>
          <p>
            As questões são elaboradas com base no edital público da Consulplan. O GuardaQuest não é
            afiliado, patrocinado ou endossado pela Consulplan ou pela Prefeitura de Manaus.
          </p>
        </Section>

        <Section title="6. Precisão do conteúdo">
          <p>
            O conteúdo é elaborado com base no edital oficial do concurso GCM Manaus 2026.
            Fazemos o possível para manter as questões atualizadas e corretas, porém{" "}
            <strong className="text-foreground">não garantimos aprovação no concurso</strong>.
            O desempenho na prova depende exclusivamente do esforço e dedicação do candidato.
          </p>
        </Section>

        <Section title="7. Suspensão e cancelamento">
          <p>Podemos suspender ou encerrar seu acesso sem aviso prévio em caso de:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Violação destes Termos de Uso</li>
            <li>Compartilhamento de acesso com terceiros</li>
            <li>Solicitação de reembolso aprovada</li>
            <li>Comportamento fraudulento ou abusivo</li>
          </ul>
        </Section>

        <Section title="8. Limitação de responsabilidade">
          <p>
            O GuardaQuest é fornecido "como está". Não somos responsáveis por:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Resultado ou aprovação no concurso</li>
            <li>Mudanças no edital ou cancelamento do concurso pela banca</li>
            <li>Interrupções temporárias do serviço por manutenção ou causas externas</li>
            <li>Perda de dados por falha de dispositivo do usuário</li>
          </ul>
        </Section>

        <Section title="9. Privacidade">
          <p>
            O tratamento dos seus dados pessoais é regido pela nossa{" "}
            <Link to="/privacidade" className="text-primary hover:underline font-medium">
              Política de Privacidade
            </Link>
            , em conformidade com a LGPD (Lei nº 13.709/2018).
          </p>
        </Section>

        <Section title="10. Alterações nos termos">
          <p>
            Podemos alterar estes Termos a qualquer momento. Mudanças significativas serão comunicadas
            por e-mail com antecedência mínima de 10 dias. O uso continuado da plataforma após
            as alterações implica aceitação dos novos termos.
          </p>
        </Section>

        <Section title="11. Lei aplicável e foro">
          <p>
            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da
            comarca de <strong className="text-foreground">Manaus/AM</strong> para resolução de
            eventuais disputas, com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </Section>

        <Section title="12. Contato">
          <p>
            Para dúvidas sobre estes Termos:{" "}
            <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
          </p>
        </Section>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          GuardaQuest · Termos de Uso · Versão {VERSAO} · {DATA_VIGENCIA}
        </div>
      </main>
    </div>
  );
};

export default TermosPage;