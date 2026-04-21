import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContentUpdate } from "@/types/database";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<ContentUpdate[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("content_updates").select("*").order("data_publicacao", { ascending: false });
    if (data) setUpdates(data);
  };

  useEffect(() => { fetchData(); }, []);

  const addUpdate = async () => {
    if (!titulo.trim() || !descricao.trim()) { toast.error("Preencha título e descrição"); return; }
    await supabase.from("content_updates").insert({ titulo: titulo.trim(), descricao: descricao.trim() });
    setTitulo("");
    setDescricao("");
    toast.success("Atualização publicada");
    fetchData();
  };

  const deleteUpdate = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("content_updates").delete().eq("id", id);
    toast.success("Excluído");
    fetchData();
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-xl font-bold text-foreground mb-6">Atualizações de Conteúdo</h1>

      <div className="stat-card space-y-3 mb-6">
        <div>
          <Label className="text-xs">Título</Label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="h-9" />
        </div>
        <div>
          <Label className="text-xs">Descrição</Label>
          <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} className="resize-none" />
        </div>
        <Button onClick={addUpdate} size="sm"><Plus className="w-4 h-4 mr-1" /> Publicar</Button>
      </div>

      <div className="space-y-2">
        {updates.map((u) => (
          <div key={u.id} className="stat-card flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{u.titulo}</p>
              <p className="text-xs text-muted-foreground mt-1">{u.descricao}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(u.data_publicacao).toLocaleDateString("pt-BR")}</p>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteUpdate(u.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUpdates;
