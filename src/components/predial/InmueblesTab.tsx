import { useState } from "react";
import { InmueblesList } from "./InmueblesList";
import { InmuebleDetail } from "./InmuebleDetail";
import { RegistrarPagoModal } from "./RegistrarPagoModal";
import type { Inmueble, GestionPredial } from "@/types/inmueble";

interface InmueblesTabProps {
  inmuebles: Inmueble[];
  pagos: GestionPredial[];
}

export function InmueblesTab({ inmuebles, pagos }: InmueblesTabProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const selected = inmuebles.find((i) => i.Id === selectedId) ?? null;
  const pago = pagos.find((p) => p.salesforce_id === selectedId);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="w-[380px] flex-shrink-0">
        <InmueblesList
          inmuebles={inmuebles}
          pagos={pagos}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
      <InmuebleDetail
        inmueble={selected}
        pago={pago}
        onRegistrarPago={() => setShowModal(true)}
      />
      {selected && (
        <RegistrarPagoModal
          open={showModal}
          onClose={() => setShowModal(false)}
          inmueble={selected}
        />
      )}
    </div>
  );
}
