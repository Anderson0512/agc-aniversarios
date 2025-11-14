import Papa from 'papaparse';

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

    // Usa o PapaParse para obter um array de objetos a partir do CSV
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim()
    });

    // Mapeia cabeçalhos originais para sua forma normalizada (útil para debug)
    const originalHeaders = (parsed && parsed.meta && parsed.meta.fields) ? parsed.meta.fields : Object.keys(parsed.data[0] || {});
    const headerMap = {};
    originalHeaders.forEach(h => {
      const nk = h.toString().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
      headerMap[h] = nk;
    });
    // console.log('Header mapping (original -> normalized):', headerMap);

    // Mapeia os objetos do PapaParse para o formato esperado pela aplicação
    const rows = [];
    const ignored = [];
    parsed.data.forEach((r, index) => {
      // Normaliza chaves para suportar cabeçalhos em português/variações
      const normMap = {};
      Object.keys(r || {}).forEach(k => {
        const nk = k.toString().toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // remove acentos
          .replace(/[^a-z0-9]/g, '');
        normMap[nk] = r[k];
      });

      const findFirst = (keys) => {
        for (const k of keys) {
          const nk = k.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          if (nk in normMap && normMap[nk] !== undefined) return normMap[nk];
        }
        // heurísticas: procura por substring
        for (const nk of Object.keys(normMap)) {
          for (const k of keys) {
            const plain = k.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
            if (nk.includes(plain) || plain.includes(nk)) return normMap[nk];
          }
        }
        return undefined;
      };

      // Considera válido qualquer registro que tenha name OR date OR photo
      const nameRaw = findFirst(['name', 'nome', 'nomecompleto', 'nome_completo', 'nome completo', 'nome completo']) || '';
      const dateRaw = findFirst(['date', 'data', 'datanascimento', 'data_de_nascimento', 'data do aniversario', 'data_do_aniversario', 'data de aniversario de casamento']) || '';
      const photoRaw = findFirst(['photo', 'foto', 'coloque aqui uma foto', 'coloqueaquiumafoto', 'coloqueaquiumafotaparacomemorarmosseuaniversario', 'coloque aqui uma foto para comemorarmos seu aniversario']) || '';
      const hasName = `${nameRaw}`.toString().trim() !== '';
      const hasDate = `${dateRaw}`.toString().trim() !== '';
      const hasPhoto = `${photoRaw}`.toString().trim() !== '';
      if (!hasName && !hasDate && !hasPhoto) {
        console.log(`Registro ${index} ignorado: sem name, date ou photo`);
        ignored.push({ index, raw: r, reason: 'sem name, date ou photo' });
        return;
      }

      const rawId = (findFirst(['id', 'carimbodedatahora', 'carimbo', 'timestamp']) || '').toString().trim();
      let id = rawId ? rawId.replace(/\s+/g, '') : '';

      const email = (findFirst(['email', 'endereçodeemail', 'enderecodeemail', 'enderecoemail', 'endereco', 'e-mail']) || '').toString().trim();
      const name = (findFirst(['name', 'nome', 'nomecompleto', 'nome_completo', 'nomecompleto']) || '').toString().trim();
      const date = (findFirst(['date', 'data', 'datanascimento', 'data_de_nascimento', 'datadenascimento', 'datadenasc', 'data do aniversario', 'data_do_aniversario']) || '').toString().trim();
      const area = (findFirst(['area', 'setor', 'department', 'departamento', 'endereco']) || '').toString().trim();
      const about = (findFirst(['about', 'sobre', 'descricao', 'description', 'fale um pouco sobre voce', 'faleumapoucosobrevocê', 'sobre e hobby', 'sobreehobby']) || '').toString().trim();
      const hobby = (findFirst(['hobby', 'hobbies', 'fale um pouco sobre voce', 'faleumapoucosobrevocohobby', 'sobre e hobby']) || '').toString().trim();

      // campos adicionais possíveis
      const phone = (findFirst(['phone', 'telefone', 'telefone de contato', 'telefone_de_contato', 'telefonedecontato']) || '').toString().trim();

      // Use o valor detectado por findFirst (mais robusto) para a foto
      let photo = (photoRaw || '').toString().trim();
      // Se ainda vazio, tenta heurística direta nas chaves originais (ex: cabeçalho exato 'foto')
      if (!photo) {
        const keysLower = Object.keys(r || {}).map(k => k && k.toString().toLowerCase());
        for (const k of keysLower) {
          if (!k) continue;
          if (k.includes('foto') || k.includes('photo') || k.includes('imagem')) {
            photo = r[Object.keys(r).find(orig => orig.toLowerCase() === k)] || '';
            break;
          }
        }
      }
      // Processa links do Google Drive
      if (photo && photo.includes('drive.google.com')) {
        const fileId = photo.match(/[-\w]{25,}/);
        if (fileId && fileId[0]) {
          photo = `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w400`;
        }
      }
      const cleanPhoto = photo ? photo.replace(/^"|"$/g, '').trim() : '';

      // // Log resumido por linha para ajudar debugging (nome, data, email, keys originais)
      // try {
      //   const previewKeys = Object.keys(r || {}).slice(0, 6);
      //   console.log(`Row ${index} -> name:${name || '<empty>'} date:${date || '<empty>'} email:${email || '<empty>'} photo:${!!cleanPhoto} keys:${previewKeys.join(',')}`);
      // } catch (e) {
      //   // ignore
      // }

      // Se não houver ID, gera um id fallback a partir do nome+data (para não perder o registro)
      if (!id) {
        // Garante que usamos string antes de aplicar .replace (index é número)
        const datePart = String(date || index);
        const fallback = `${(name || 'no-name').replace(/\s+/g, '')}_${datePart.replace(/\s+/g, '').replace(/\//g, '')}`;
        console.log(`Registro ${index} sem ID — gerando fallback id: ${fallback}`);
        id = fallback;
      }

      rows.push({
        // Mantém referência ao índice/origem no CSV para facilitar debug/associação
        sourceIndex: index,
        raw: r,
        id: id.toString(),
        email: email || '',
        name: name || '',
        date: date || '',
        area: area || '',
        about: about || '',
        hobby: hobby || '',
        phone: phone || '',
        photo: cleanPhoto
      });
    });

    return { rows, ignored };

  } catch (error) {
    console.error('Erro ao carregar dados do Google Sheets:', error);
    return [];
  }
};