(async function() {
  const response = await fetch("https://gegen-den-virus.de:8080/emulate/pdf", {
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
            "src": "data/templates/corona2/doc.html",
            "alias": "Document"
          }
        ],
        "fonts": [],
        "fields": []
      },
      doc: 0,
      data: {
        "intro": `
          Liebe Nachbarschaft,
          <br>
          liebe Hausgemeinschaft,
          <br><br>
          sollten Sie zu einer der durch die derzeitige Pandemie (Coronavirus SARS CoV 2) betroffenen <strong>Risikogruppen</strong> gehören (hohes Alter, Immunschwäche oder bestimmte Grunderkrankungen) möchte ich/möchten wir Sie <u>unterstützen gesund zu bleiben.</u>
          <strong>Gemeinsam schaffen wir das!</strong>
        `,
        "box1": {
          "title": "WIR HELFEN:",
          "items": [
            "Einkäufe und Besorgungen erledigen",
            "Mit dem Hund gehen",
            "Internetzugang bereitstellen",
            "... und Weiteres: Sprechen Sie mich gerne an"
          ]
        },
        "box2": {
          "title": "KONTAKT:",
          "items": [
            "Mein Name: Maurice Conrad",
            "Telefonnummer: +49 176 74932702",
            "Ich wohne im 2. Stock"
          ]
        },
        "paragraph1": `<strong>Rufen Sie an</strong> oder hinterlassen Sie einen <strong>Zettel im Briefkasten.</strong>`
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
