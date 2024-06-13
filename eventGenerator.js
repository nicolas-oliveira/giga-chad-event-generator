
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

let event = ""

const exceptions = {
	"[fluxo atual]": "<? $bot.fluxo_atual ?>"
}

const eventPatterns = {
	"event_name": /\b(\w+_name|\bname\b)/g,
	"extra1": /\b(extra1)/g,
	"extra2": /\b(extra2)/g,
	"field1": /\b(field1)/g,
	"field2": /\b(field2)/g,
	"field3": /\b(field3)/g,
	"field4": /\b(field4)/g,
	"field5": /\b(field5)/g
}

function parseToKeyValue(eventString) {
	const lines = eventString.split('\n').filter(line => line);
	const keyValuePairs = lines.map(line => {
		let symbol = ""
		if (line.includes('=')) symbol = '=';
		if (line.includes(':')) symbol = ':';
		
		const [key, value] = line.split(symbol).map(part => part.trim());

		if (eventPatterns.event_name.test(key)) return ["event_name", value]
		if (eventPatterns.field1.test(key)) return ["details.field1", value]
		if (eventPatterns.field2.test(key)) return ["details.field2", value]
		if (eventPatterns.field3.test(key)) return ["details.field3", value]
		if (eventPatterns.field4.test(key)) return ["details.field4", value]
		if (eventPatterns.field5.test(key)) return ["details.field5", value]
		
		return [key, value];
	});
	return keyValuePairs;
}

function createDumbVariables(keyValuePairs) {
	const variables = {}
	keyValuePairs.forEach(([key, value]) => {
			// Criar um objeto se ele ainda não existir
				variables[key] = value || {};
		}
	)
	return variables
}

function replaceTemplate(templateString, replacements) {
	return templateString.replace(/%%(\w.+)%%/g, (placeholder, variableName) => {
		if (variableName in replacements && typeof replacements[variableName] == "string") {
			return replacements[variableName]
		} 		
		return ""
	})
}

const variablesResult = document.getElementById("variablesResult")
const eventResult = document.getElementById("eventResult")


function listenToTextareaChange() {
	const textarea = document.getElementById('inputUser');
	if (textarea) {
			textarea.addEventListener('input', (event) => {
				event = event.target.value
				const eventVariables = createDumbVariables(parseToKeyValue(event))
				// Run exceptions
				Object.keys(eventVariables).map(key => 
					exceptions[eventVariables[key]] ?  
					eventVariables[key] = exceptions[eventVariables[key]] : null
				)

				variablesResult.textContent = replaceTemplate(templateVariable, eventVariables)
				eventResult.textContent = replaceTemplate(templateEvent, eventVariables)
			});
	}
}
listenToTextareaChange()

