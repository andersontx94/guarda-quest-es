import React, { useEffect, useState } from "react";
import { Trophy, Medal, Crown, TrendingUp, Calendar, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RankingEntry {
  posicao: number;
  nome_exibido: string;
  avatar_cor: string;
  total_simulados: number;
  simulados_aprovados: number;
  melhor_pontuacao: number;
  media_pontuacao: number;
  pontos_ranking: number;
  streak_simulados: number;
  taxa_acerto_geral: number;
  titulo: string;
  user_id: string;
}

interface RankingSemanalEntry {
  posicao: number;
  nome_exibido: string;
  avatar_cor: string;
  simulados_semana: number;
  pontuacao_semana: number;
  taxa_acerto_semana: number;
  titulo: string;
  user_id: string;
}

interface MinhaPos {
  participando: boolean;
  nickname: string | null;
  avatar_cor: string;
  posicao_geral: number;
  total_no_ranking: number;
  pontos_ranking: number;
  total_simulados: number;
  melhor_pontuacao: number;
  media_pontuacao: number;
  streak_simulados: number;
  titulo: string;
}

const medalColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

const AvatarCircle: React.FC<{ cor: string; nome: string; size?: string }> = ({
  cor,
  nome,
  size = "w-9 h-9",
}) => (
  <div
    className={`${size} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
    style={{ backgroundColor: cor }}
  >
    {nome.charAt(0).toUpperCase()}
  </div>
);

const RankingPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [rankingGeral, setRankingGeral] = useState<RankingEntry[]>([]);
  const [rankingSemanal, setRankingSemanal] = useState<RankingSemanalEntry[]>([]);
  const [minhaPos, setMinhaPos] = useState<MinhaPos | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const [participando, setParticipando] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatarCor, setAvatarCor] = useState("#3B82F6");

  const cores = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
  ];

  const carregar = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;

      const [geralRes, semanalRes, minhaRes] = await Promise.all([
        sb.from("ranking_geral").select("*").limit(50),
        sb.from("ranking_semanal_atual").select("*").limit(50),
        sb.rpc("minha_posicao_ranking", { p_user_id: user.id }),
      ]);

      setRankingGeral((geralRes.data as RankingEntry[]) || []);
      setRankingSemanal((semanalRes.data as RankingSemanalEntry[]) || []);

      if (minhaRes.data) {
        const m = minhaRes.data as MinhaPos;
        setMinhaPos(m);
        setParticipando(m.participando || false);
        setNickname(m.nickname || "");
        setAvatarCor(m.avatar_cor || "#3B82F6");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [user]);

  const salvarConfig = async () => {
    if (!user) return;
    setSalvando(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("profiles")
        .update({
          participar_ranking: participando,
          nickname: nickname.trim() || null,
          avatar_cor: avatarCor,
        })
        .eq("user_id", user.id);

      toast({
        title: participando ? "🏆 Você entrou no ranking!" : "Configuração salva",
        description: participando
          ? "Seus simulados agora aparecem no ranking público."
          : "Você saiu do ranking. Seus dados ficam privados.",
      });
      await carregar();
      setMostrarConfig(false);
    } catch (e) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };

  const meuId = user?.id;

  return (
    <div className="page-container animate-slide-up max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2 font-display">
            <Trophy className="w-5 h-5 text-yellow-500" /> Ranking
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Baseado nos simulados concluídos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={carregar} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9"
            onClick={() => setMostrarConfig(!mostrarConfig)}
          >
            {participando
              ? <Eye className="w-4 h-4 text-green-500" />
              : <EyeOff className="w-4 h-4" />}
            {participando ? "Visível" : "Oculto"}
          </Button>
        </div>
      </div>

      {/* Card de configuração */}
      {mostrarConfig && (
        <div className="premium-card p-5 mb-5 border-2 border-primary/20">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Configurações do Ranking
          </h2>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl mb-4">
            <div>
              <p className="text-sm font-semibold">Participar do ranking público</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {participando
                  ? "Seus resultados aparecem para todos"
                  : "Seus dados ficam 100% privados"}
              </p>
            </div>
            <Switch checked={participando} onCheckedChange={setParticipando} />
          </div>

          {participando && (
            <>
              <div className="mb-4">
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Apelido no ranking (opcional)
                </label>
                <Input
                  placeholder="Ex: GuardaConcurseiro, AnaGCM2026..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={30}
                  className="h-10"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Se não definir, aparecerá como "Candidato XXXX"
                </p>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Cor do seu avatar
                </label>
                <div className="flex gap-2 flex-wrap">
                  {cores.map((cor) => (
                    <button
                      key={cor}
                      onClick={() => setAvatarCor(cor)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        avatarCor === cor
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl mb-4">
                <AvatarCircle cor={avatarCor} nome={nickname || "C"} />
                <div>
                  <p className="text-sm font-bold">{nickname || "Candidato XXXX"}</p>
                  <p className="text-xs text-muted-foreground">Como você aparece no ranking</p>
                </div>
              </div>
            </>
          )}

          <Button
            onClick={salvarConfig}
            disabled={salvando}
            className="w-full h-10 font-bold rounded-xl"
            style={{ background: "var(--gradient-hero)" }}
          >
            {salvando ? "Salvando..." : "Salvar configurações"}
          </Button>
        </div>
      )}

      {/* Minha posição */}
      {minhaPos && participando && (
        <div className="premium-card p-4 mb-5 border border-primary/30 bg-primary/5">
          <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            Sua posição
          </p>
          <div className="flex items-center gap-3">
            <div className="text-center min-w-[48px]">
              <p className="text-2xl font-black text-primary font-display">
                #{minhaPos.posicao_geral}
              </p>
              <p className="text-[10px] text-muted-foreground">
                de {minhaPos.total_no_ranking}
              </p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-base font-extrabold font-display">
                  {Number(minhaPos.melhor_pontuacao).toFixed(0)}%
                </p>
                <p className="text-[10px] text-muted-foreground">Melhor nota</p>
              </div>
              <div className="text-center">
                <p className="text-base font-extrabold font-display">
                  {minhaPos.total_simulados}
                </p>
                <p className="text-[10px] text-muted-foreground">Simulados</p>
              </div>
              <div className="text-center">
                <p className="text-base font-extrabold font-display">
                  🔥{minhaPos.streak_simulados}
                </p>
                <p className="text-[10px] text-muted-foreground">Streak</p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {minhaPos.titulo}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {Number(minhaPos.pontos_ranking).toFixed(0)} pontos
            </span>
          </div>
        </div>
      )}

      {/* Aviso modo privado */}
      {!participando && (
        <div className="premium-card p-4 mb-5 text-center border border-dashed border-muted-foreground/30">
          <EyeOff className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">
            Você está no modo privado
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Ative o ranking para aparecer no placar e competir com outros candidatos!
          </p>
          <Button
            size="sm"
            onClick={() => { setParticipando(true); setMostrarConfig(true); }}
            style={{ background: "var(--gradient-hero)" }}
            className="h-8 text-xs font-bold rounded-lg"
          >
            🏆 Quero participar do ranking!
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="geral">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="geral" className="flex-1 gap-1.5">
            <Crown className="w-3.5 h-3.5" /> Geral
          </TabsTrigger>
          <TabsTrigger value="semanal" className="flex-1 gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Esta semana
          </TabsTrigger>
        </TabsList>

        {/* Ranking Geral */}
        <TabsContent value="geral">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="premium-card p-4 animate-pulse h-16 bg-muted/30" />
              ))}
            </div>
          ) : rankingGeral.length === 0 ? (
            <div className="premium-card p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">Ranking ainda vazio</p>
              <p className="text-xs text-muted-foreground mt-1">
                Faça simulados e habilite o ranking para aparecer aqui!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rankingGeral.map((entry) => {
                const isMe = entry.user_id === meuId;
                return (
                  <div
                    key={entry.user_id}
                    className={`premium-card p-3.5 flex items-center gap-3 transition-all ${
                      isMe ? "border-2 border-primary/40 bg-primary/5" : ""
                    }`}
                  >
                    <div className="w-7 text-center shrink-0">
                      {entry.posicao <= 3 ? (
                        <Medal className={`w-5 h-5 mx-auto ${medalColors[entry.posicao]}`} />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {entry.posicao}
                        </span>
                      )}
                    </div>
                    <AvatarCircle cor={entry.avatar_cor} nome={entry.nome_exibido} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                        {entry.nome_exibido}
                        {isMe && <span className="text-[10px] font-normal ml-1">(você)</span>}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {entry.titulo} • {entry.total_simulados} simulados • 🔥{entry.streak_simulados}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-extrabold font-display text-foreground">
                        {Number(entry.melhor_pontuacao).toFixed(0)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {Number(entry.pontos_ranking).toFixed(0)} pts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Ranking Semanal */}
        <TabsContent value="semanal">
          <div className="mb-3 px-1">
            <p className="text-xs text-muted-foreground">
              📅 Reseta toda segunda-feira • Quem mais simular esta semana sobe!
            </p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="premium-card p-4 animate-pulse h-16 bg-muted/30" />
              ))}
            </div>
          ) : rankingSemanal.length === 0 ? (
            <div className="premium-card p-8 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">
                Nenhum simulado esta semana
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Faça um simulado hoje para entrar no ranking semanal!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rankingSemanal.map((entry) => {
                const isMe = entry.user_id === meuId;
                return (
                  <div
                    key={entry.user_id}
                    className={`premium-card p-3.5 flex items-center gap-3 ${
                      isMe ? "border-2 border-primary/40 bg-primary/5" : ""
                    }`}
                  >
                    <div className="w-7 text-center shrink-0">
                      {entry.posicao <= 3 ? (
                        <Medal className={`w-5 h-5 mx-auto ${medalColors[entry.posicao]}`} />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {entry.posicao}
                        </span>
                      )}
                    </div>
                    <AvatarCircle cor={entry.avatar_cor} nome={entry.nome_exibido} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                        {entry.nome_exibido}
                        {isMe && <span className="text-[10px] font-normal ml-1">(você)</span>}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {entry.titulo} • {entry.simulados_semana} simulados
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-extrabold font-display">
                        {Number(entry.taxa_acerto_semana).toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {Number(entry.pontuacao_semana).toFixed(0)} pts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Legenda */}
      <div className="mt-6 premium-card p-4">
        <p className="text-xs font-bold text-muted-foreground mb-2">
          Como funciona a pontuação?
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Os pontos do ranking são a <strong>soma das suas 5 melhores notas</strong> nos
          simulados. Cada simulado pode melhorar sua posição — sem punição por dias ruins!
          O ranking semanal reseta toda segunda-feira. 🔥
        </p>
      </div>
    </div>
  );
};

export default RankingPage;