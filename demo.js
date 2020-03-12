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
            "default": "",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Paragraph 1",
            "key": "paragraph1",
            "default": "",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Explanation",
            "key": "explanation",
            "default": "",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Paragraph 2",
            "key": "paragraph2",
            "default": "",
            "properties": {

            }
          },
          {
            "type": "Line",
            "description": "Name",
            "key": "name",
            "default": "",
            "properties": {

            }
          }
        ]
      },
      doc: 0,
      data: {
        "intro": "test",
        "paragraph1": "test2",
        "explanation":"test3",
        "paragraph2": "test4",
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
