(async function() {
  const response = fetch("https://gegen-den-virus.de:8080/emulate/pdf", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template: {
        "type": "pdf",
        "documents": [
          {
            "width": 2480,
            "height": 3508,
            "type": "html",
            "src": "data/templates/corona/doc.html",
            "alias": "Document"
          }
        ],
        "fonts": [

        ],
        "fields": [
          {
            "type": "Line",
            "description": "Intro",
            "key": "intro",
            "default": "nicht alle von euch kennen wir: manche flüchtig aus Treppenhausbegegnungen,  andere durch kurze Gespräche zwischen Tür und Angel. So nehmen einige von euch öfter unsere Pakete an, sorgen dafür, dass es im Treppenhaus jetzt besser riecht oder  ersetzen alte Leuchten durch LEDs. Alles praktische Nachbarschaftshilfe, für die wir  sehr dankbar sind und nicht immer im Alltag unseren Dank zum Ausdruck bringen!  Vielleicht haben wir uns auch schon mal über einander aufgeregt, weil ihr auf  unserem Parkplatz standet oder umgekehrt – Zusammenleben in einem Mietshaus bringt sicher auch das mit sich.",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Paragraph 1",
            "key": "paragraph1",
            "default": "In dieser aktuell merkwürdigen und dichten Zeit mit einem neuartigen Virus, der auf vielen verschiedenen Ebenen Chaos verursacht, setzen wir auf <strong>SOLIDARITÄT</strong> und  haben uns überlegt, was das für uns praktisch bedeutet:",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Explanation",
            "key": "explanation",
            "default": "Wir gehören nicht zur Risikogruppe von Corona und sind aktuell nicht erkrankt. Wir  bieten deshalb gerne unsere tatkräftige Hilfe und Unterstützung an. Wir könnten  z.B. einen Einkauf für euch erledigen, eine Fahrt übernehmen oder euch/Ihnen mit  einem technischen Problem helfen, unsere Fahrräder ausleihen, wenn jemand  aktuell auf die Öffentlichen verzichten möchte oder haben einfach ein Ohr, wenn  ihr etwas Belastendes zu erzählen habt.",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Paragraph 2",
            "key": "paragraph2",
            "default": "Ich wohne im 3. Stock und arbeite tagsüber. Meistens bin ich ab 16 Uhr zu Hause. Gerne einfach klingen oder mich anrufen: <strong>0176 749 32702</strong>",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Name",
            "key": "name",
            "default": "Familie Yilmaz",
            "properties": {

            }
          }
        ]
      },
      doc: 0,
      data: {
        "intro": "nicht alle von euch kennen wir: manche fl\xfcchtig aus Treppenhausbegegnungen,\u2029 andere durch kurze Gespr\xe4che zwischen T\xfcr und Angel. So nehmen einige von euch\u2029\xf6fter unsere Pakete an, sorgen daf\xfcr, dass es im Treppenhaus jetzt besser riecht oder\u2029 ersetzen alte Leuchten durch LEDs. Alles praktische Nachbarschaftshilfe, f\xfcr die wir\u2029 sehr dankbar sind und nicht immer im Alltag unseren Dank zum Ausdruck bringen\041\u2029 Vielleicht haben wir uns auch schon mal \xfcber einander aufgeregt, weil ihr auf\u2029 unserem Parkplatz standet oder umgekehrt \u2013 Zusammenleben in einem Mietshaus\u2029bringt sicher auch das mit sich.",
        "paragraph1": "In dieser aktuell merkw\xfcrdigen und dichten Zeit mit einem neuartigen Virus, der auf\u2029vielen verschiedenen Ebenen Chaos verursacht, setzen wir auf <strong>SOLIDARIT\xc4T</strong> und\u2029 haben uns \xfcberlegt, was das f\xfcr uns praktisch bedeutet:",
        "explanation":"Wir geh\xf6ren nicht zur Risikogruppe von Corona und sind aktuell nicht erkrankt. Wir\u2029 bieten deshalb gerne unsere tatkr\xe4ftige Hilfe und Unterst\xfctzung an. Wir k\xf6nnten\u2029 z.B. einen Einkauf f\xfcr euch erledigen, eine Fahrt \xfcbernehmen oder euch/Ihnen mit\u2029 einem technischen Problem helfen, unsere Fahrr\xe4der ausleihen, wenn jemand\u2029 aktuell auf die \xd6ffentlichen verzichten m\xf6chte oder haben einfach ein Ohr, wenn\u2029 ihr etwas Belastendes zu erz\xe4hlen habt.",
        "paragraph2": "Ich wohne im 3. Stock und arbeite tags\xfcber. Meistens bin ich ab 16 Uhr zu Hause. Gerne einfach klingen oder mich anrufen: <strong>0176 749 32702</strong>",
        "name": "Familie Yilmaz"
      },
      renderings: 1,
      delay: 250
    })
  });

  const responseMime = response.headers.get("Content-Type");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  window.open(url);

  console.log(url);
})();
