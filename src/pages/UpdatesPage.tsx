import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ContentUpdate } from "@/types/database";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/LoadingSkeleton";

const UpdatesPage: React.FC = () => {
  const [updates, setUpdates] = useState<ContentUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("content_updates")
      .select("*")
      .order("data_publicacao", { ascending: false })
      .then(({ data }) => {
        if (data) setUpdates(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container animate-slide-up">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5" /> Atualizações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Novidades e atualizações do conteúdo</p>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : updates.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nenhuma atualização"
          description="Quando houver novidades no conteúdo, elas aparecerão aqui."
        />
      ) : (
        <div className="space-y-3">
          {updates.map((u) => (
            <div key={u.id} className="stat-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{u.titulo}</p>
                  <p className="text-sm text-muted-foreground mt-1">{u.descricao}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {new Date(u.data_publicacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdatesPage;
