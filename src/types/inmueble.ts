export interface Inmueble {
  Id: string;
  Name: string;
  Ciudad__c?: string;
  chip_apartamento__c?: string;
  Numero_matricula_inmobiliaria__c?: string;
  Fiduciaria__c?: string;
  Proceso_entrega_inmueble__c?: string;
  Direcci_n__c?: string;
  Cliente__c?: string;
  [key: string]: any;
}

export interface GestionPredial {
  id: string;
  salesforce_id: string;
  nombre_inmueble?: string;
  anio_vigencia?: number;
  fecha_pago?: string;
  valor_pago?: number;
  valor_avaluo?: number;
  url_soporte?: string;
  notas?: string;
  estado?: string;
  created_at?: string;
}
