export interface TableMetaData {
  section: string;
  column_name: string;
  data_type: string;
  column_description: string;
  sensitive: boolean;
}

export interface ResearchViewTable {
  table: string;
  columns: Columns[];
}

export interface Columns {
  name: string;
  data_type: string;
  primary: boolean;
  max_length?: number;
  description: string;
  table: string;
}

export interface Condition {
  column_name: string;
  operator: string;
  value: string;
  reason: string;
  data_type: string;
}

export interface ReviewData {
  requestor: string;
  org: string;
  general_reason: string;
  comment: string;
  table: string;
  conditions: Condition[];
  sql_query: string;
}

export interface Option {
  value: number;
  label: string | undefined;
}
