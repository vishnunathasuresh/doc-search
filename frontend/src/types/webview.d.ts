interface QueryResponse {
    message: string;// Description of the response
    rows: any[];
    status: string;// 'success' | 'error'
}

interface PyWebViewApi {
  execute(
    query: string,
    args?: any[]
  ): Promise<QueryResponse>;
}


