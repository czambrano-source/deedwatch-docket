export interface Inmueble {
  Id: string;
  Name: string;
  Opportunity__r?: { Name?: string };
  Ciudad_Inmueble__c?: string;
  Direccion__c?: string;
  Torre__c?: string;
  Numero_de_apartamento__c?: string;
  chip_apartamento__c?: string;
  Numero_matricula_inmobiliaria__c?: string;
  Fiduciaria__c?: string;
  Parqueadero__c?: number;
  chip_parqueadero__c?: string;
  Legales__r?: {
    totalSize?: number;
    done?: boolean;
    records?: Array<{ Fecha_firma_escritura__c?: string }>;
  };
  Proceso_entrega_inmueble__c?: string;
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
