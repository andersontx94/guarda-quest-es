import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const VERSAO = "1.0";
const DATA_VIGENCIA = "27 de março de 2026";
const EMAIL_DPO = "suporte@guardaquest.com.br";
const SITE = "https://www.guardaquest.com.br";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
    <div className="text-sm text-muted-foreground leading-7 space-y-3">{children}</div>
  </div>
);

const PrivacidadePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        {/* Título */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-foreground mb-2">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">
            Versão {VERSAO} · Vigente a partir de {DATA_VIGENCIA}
          </p>
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/15 text-sm text-foreground">
            Esta Política de Privacidade descreve como o <strong>GuardaQuest</strong> coleta, usa, armazena e protege
            suas informações pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
          </div>
        </div>

        <Section title="1. Quem somos">
          <p>
            O <strong className="text-foreground">GuardaQuest</strong> é uma plataforma digital de preparação para concursos públicos,
            operada por Anderson Robson Teixeira, com sede em Manaus/AM, Brasil.
          </p>
          <p>
            <strong className="text-foreground">Encarregado de Dados (DPO):</strong><br />
            E-mail: <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a><br />
            Site: <a href={SITE} className="text-primary hover:underline">{SITE}</a>
          </p>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>Coletamos apenas os dados estritamente necessários para o funcionamento da plataforma:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-semibold text-foreground">Dado</th>
                  <th className="text-left p-3 font-semibold text-foreground">Finalidade</th>
                  <th className="text-left p-3 font-semibold text-foreground">Base legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["E-mail", "Autenticação e comunicação", "Execução de contrato"],
                  ["Nome completo", "Personalização da plataforma", "Execução de contrato"],
                  ["Progresso de estudos", "Funcionalidades da plataforma", "Execução de contrato"],
                  ["Dados de pagamento", "Processados pela Hotmart (não armazenamos)", "Execução de contrato"],
                  ["IP e User Agent", "Segurança e prevenção de fraudes", "Legítimo interesse"],
                  ["Cookies essenciais", "Manter a sessão ativa", "Legítimo interesse"],
                ].map(([dado, fin, base]) => (
                  <tr key={dado} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{dado}</td>
                    <td className="p-3">{fin}</td>
                    <td className="p-3">{base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            <strong className="text-foreground">Não coletamos</strong> dados sensíveis (saúde, biometria, origem racial,
            convicções religiosas ou políticas).
          </p>
        </Section>

        <Section title="3. Como usamos seus dados">
          <ul className="list-disc list-inside space-y-1">
            <li>Criar e gerenciar sua conta na plataforma</li>
            <li>Liberar seu acesso após a compra e revogar após cancelamento</li>
            <li>Enviar comunicações transacionais (acesso, senha, confirmação)</li>
            <li>Manter o histórico de progresso e desempenho nos estudos</li>
            <li>Garantir a segurança e prevenir fraudes</li>
            <li>Cumprir obrigações legais</li>
          </ul>
          <p>
            <strong className="text-foreground">Não vendemos</strong> seus dados a terceiros. Não usamos seus dados
            para publicidade comportamental.
          </p>
        </Section>

        <Section title="4. Compartilhamento de dados">
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-foreground">Hotmart</strong> — processamento de pagamentos (somente e-mail e nome para vincular a compra)</li>
            <li><strong className="text-foreground">Supabase</strong> — infraestrutura de banco de dados (servidores na região sa-east-1, Brasil)</li>
            <li><strong className="text-foreground">Vercel</strong> — hospedagem do site (servidores nos EUA — com cláusulas contratuais padrão)</li>
            <li><strong className="text-foreground">Locaweb</strong> — serviço de e-mail transacional</li>
          </ul>
          <p>
            Todos os parceiros são subprocessadores que operam sob contratos de proteção de dados e não
            têm autorização para usar seus dados para finalidades próprias.
          </p>
        </Section>

        <Section title="5. Retenção de dados">
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-foreground">Dados de conta:</strong> mantidos enquanto a conta existir</li>
            <li><strong className="text-foreground">Dados de compra:</strong> 5 anos (obrigação fiscal)</li>
            <li><strong className="text-foreground">Logs de segurança:</strong> 90 dias</li>
            <li><strong className="text-foreground">Após solicitação de exclusão:</strong> excluídos em até 30 dias, exceto quando há obrigação legal de retenção</li>
          </ul>
        </Section>

        <Section title="6. Seus direitos (LGPD — Art. 18)">
          <p>Você tem direito a:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["🔍 Acesso", "Saber quais dados temos sobre você"],
              ["✏️ Correção", "Corrigir dados incompletos ou incorretos"],
              ["🗑️ Exclusão", "Solicitar a exclusão dos seus dados"],
              ["📦 Portabilidade", "Receber seus dados em formato estruturado"],
              ["🚫 Oposição", "Opor-se ao tratamento dos seus dados"],
              ["📋 Informação", "Saber com quem compartilhamos seus dados"],
            ].map(([titulo, desc]) => (
              <div key={titulo} className="p-3 rounded-xl border border-border bg-muted/20">
                <p className="font-semibold text-foreground text-sm">{titulo}</p>
                <p className="text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3">
            Para exercer qualquer direito, envie um e-mail para{" "}
            <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a>{" "}
            com o assunto <strong className="text-foreground">"Direitos LGPD"</strong>. Responderemos em até 15 dias úteis.
          </p>
        </Section>

        <Section title="7. Segurança">
          <p>Adotamos medidas técnicas e organizacionais para proteger seus dados:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Comunicação criptografada via HTTPS (TLS 1.2+)</li>
            <li>Banco de dados com Row Level Security (RLS) — cada usuário acessa apenas seus próprios dados</li>
            <li>Autenticação com confirmação de e-mail obrigatória</li>
            <li>Headers de segurança HTTP (CSP, HSTS, X-Frame-Options)</li>
            <li>Tokens de acesso com expiração automática</li>
          </ul>
        </Section>

        <Section title="8. Cookies">
          <p>Utilizamos apenas cookies essenciais para o funcionamento da plataforma:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-foreground">sb-access-token:</strong> mantém sua sessão ativa (expira conforme configuração)</li>
            <li><strong className="text-foreground">sb-refresh-token:</strong> renova a sessão automaticamente</li>
          </ul>
          <p>
            Não utilizamos cookies de rastreamento, publicidade ou analytics de terceiros.
          </p>
        </Section>

        <Section title="9. Crianças e adolescentes">
          <p>
            O GuardaQuest é destinado a candidatos do concurso GCM Manaus 2026, que exige idade mínima de 18 anos.
            Não coletamos intencionalmente dados de menores de 18 anos. Se identificarmos tal situação,
            excluiremos os dados imediatamente.
          </p>
        </Section>

        <Section title="10. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas
            por e-mail com antecedência mínima de 10 dias. A data de vigência sempre indicará a versão atual.
          </p>
        </Section>

        <Section title="11. Contato e canal de denúncias">
          <p>
            Para dúvidas, solicitações ou denúncias relacionadas à privacidade:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>E-mail: <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a></li>
            <li>Você também pode reclamar à <strong className="text-foreground">ANPD</strong> (Autoridade Nacional de Proteção de Dados): <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.gov.br/anpd</a></li>
          </ul>
        </Section>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          GuardaQuest · Política de Privacidade · Versão {VERSAO} · {DATA_VIGENCIA}<br />
          Em conformidade com a Lei nº 13.709/2018 (LGPD)
        </div>
      </main>
    </div>
  );
};

export default PrivacidadePage;