// const event = 
// `
// event_name = chamada_api

// extra1 = status_code

// extra2 = [nome da api]

// details.field1 = [fluxo atual]
// `

let event = ""

const exceptions = {
	"[fluxo atual]": "<? $bot.fluxo_atual ?>"
}

function parseEvent(eventString) {
	const lines = eventString.split('\n').filter(line => line);
	const keyValuePairs = lines.map(line => {
		let symbol = ""
		if (line.includes('=')) symbol = '=';
		if (line.includes(':')) symbol = ':';
		const [key, value] = line.split(symbol).map(part => part.trim());
		return [key, value];
	});
	return keyValuePairs;
}

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

function createDumbVariables(keyValuePairs) {
	let variables = {}
	keyValuePairs.forEach(([key, value]) => {
			// Criar um objeto se ele ainda não existir
			variables[key] = value || {};
		}
	)
	return variables
}


const templateVariable =
`{
  "context": {
      "bot": {
          "eventos": {
              "%%event_name%%": {
                  "name": "%%event_name%%",
                  "extra1": "%%extra1%%",
                  "extra2": "%%extra2%%",
                  "details": {
                      "field1": "%%details.field1%%",
                      "field2": "%%details.field2%%",
                      "field3": "%%details.field3%%",
                      "field4": "%%details.field4%%",
                      "field5": "%%details.field5%%"
                  }
              }
          }
      }
  }
}
`

const templateEvent = 
`[
  {
      "extra1": "<? $bot.eventos.%%event_name%%.extra1 ?>",
      "extra2": "<? $bot.eventos.%%event_name%%.extra2 ?>",
      "details": {
          "field1": "<? $bot.eventos.%%event_name%%.details.field1 ?>",
          "field2": "<? $bot.eventos.%%event_name%%.details.field2 ?>",
          "field3": "<? $bot.eventos.%%event_name%%.details.field3 ?>",
          "field4": "<? $bot.eventos.%%event_name%%.details.field4 ?>",
          "field5": "<? $bot.eventos.%%event_name%%.details.field5 ?>"
      },
      "event_name": "<? $bot.eventos.%%event_name%%.name ?>"
  }
]
`

function replaceTheReplacementsValue(stringToReplace, replacements) {
	return stringToReplace.replace(/%%(\w.+)%%/g, (placeholder, key) => {
        return key in replacements ? replacements[key] : ""
	})
}


const variablesResult = document.getElementById("variablesResult")
const eventResult = document.getElementById("eventResult")


function listenToTextareaChange() {
	const textarea = document.getElementById('inputUser');
	if (textarea) {
			textarea.addEventListener('input', (event) => {
				event = event.target.value
				const eventVariables = createDumbVariables(parseEvent(event))
				console.log(eventVariables)
				// Run exceptions
				Object.keys(eventVariables).map(key => 
					exceptions[eventVariables[key]] ?  
					eventVariables[key] = exceptions[eventVariables[key]] : null
				)

				variablesResult.textContent = replaceTheReplacementsValue(templateVariable, eventVariables)
				eventResult.textContent = replaceTheReplacementsValue(templateEvent, eventVariables)
			});
	}
}
listenToTextareaChange()

