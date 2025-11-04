// URL do Google Sheets em formato CSV (carregada das variáveis de ambiente)
const SHEET_URL = process.env.REACT_APP_SHEET_URL;

// Verifica se a URL foi definida
if (!SHEET_URL) {
  console.error('A variável de ambiente REACT_APP_SHEET_URL não foi definida!');
}

export const loadSheetData = async () => {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados da planilha: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    
    // Converte o CSV para array de objetos
    const rows = csvText
      .split('\n')
      .slice(1) // Remove o cabeçalho
      .filter(row => row.trim()) // Remove linhas vazias
      .map((row, index) => {
        
        // Divide a linha usando vírgula, mas preserva vírgulas dentro de aspas
        const fields = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        // Remove aspas e espaços em branco de cada campo
        const cleanFields = fields.map(field => field.replace(/^"|"$/g, '').trim());
        
        const [rawId, email, name, date, area, about, hobby, photo] = cleanFields;
        
        // Remove o espaço do ID
        const id = rawId ? rawId.replace(/\s+/g, '') : rawId;
        
        // Processa a URL da foto do Google Drive para URL de miniatura
        let cleanPhoto = photo ? photo.replace(/^["']|["']$/g, '').trim() : '';
        
        // Converte URL do Google Drive para URL de miniatura
        if (cleanPhoto && cleanPhoto.includes('drive.google.com')) {
          const fileId = cleanPhoto.match(/[-\w]{25,}/);
          if (fileId && fileId[0]) {
            // Usa o formato de miniatura do Google Drive que é mais confiável
            cleanPhoto = `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w400`;
          }
        }

        const person = {
          id: id.toString(), // Garante que o ID é uma string
          email: email || '',
          name: name || '',
          date: date || '',
          area: area || '',
          about: about || '',
          hobby: hobby || '',
          photo: cleanPhoto
        };
        
        return person;
      });

    console.log('Total de registros processados:', rows.length);
    return rows;

  } catch (error) {
    console.error('Erro ao carregar dados do Google Sheets:', error);
    return [];
  }
};