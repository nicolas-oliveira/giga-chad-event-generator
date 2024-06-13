// Função para criar dinamicamente variáveis em um objeto com base nas chaves
function nestAllVariables(keyValuePairs) {
	const variables = {};
	keyValuePairs.forEach(([key, value]) => {
			// Manipular propriedades aninhadas (por exemplo, "details.field1")
			const keys = key.split('.');
			let current = variables;

			// Percorrer o objeto e criar objetos aninhados, se necessário
			keys.forEach((k, i) => {
					if (i === keys.length - 1) {
							// Definir o valor no nível mais profundo
							current[k] = value;
					} else {
							// Criar um objeto se ele ainda não existir
							current[k] = current[k] || {};
							current = current[k];
					}
			});
	});
	return variables;
}