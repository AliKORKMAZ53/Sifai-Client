// public/script.js
document.getElementById('topic-select').addEventListener('change', onTopicChange);
document.getElementById('book-select').addEventListener('change', onBookChange);

 var data = null;
 //ibare soru
async function fetchQuestion() {
  const book = document.getElementById('book-select').value;
  const topic = document.getElementById('topic-select').value;
  const subtopic = document.getElementById('subtopic-select').value;

  const requestBody = {
    kitapAdi : book
  };
try {
    const response = await fetch('http://sifai-app.onrender.com/api/ibare/random', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    data = await response.json();
    document.getElementById('question').innerText = "İbare: \n" + data.ibareMetni;
  

    // Show buttons for Ibare topic
    if (topic === 'Ibare') {
		
	
      document.getElementById('related-btn').style.display = 'inline-block';
      document.getElementById('similar-btn').style.display = 'inline-block';
    }/*else if(topic === 'Malumat'){
			
	}*/
  } catch (error) {
    document.getElementById('question').innerText = 'Failed to load question.';
    console.error(error);
  }
}

//terkip soru
async function fetchRelatedQuestion() {
  const book = document.getElementById('book-select').value;
  const topic = document.getElementById('topic-select').value;

  try {
    
    document.getElementById('question').innerText = "Terkip Soru: \n" + data.terkipSoru;
  } catch (error) {
    document.getElementById('question').innerText = 'Failed to load related question.';
    console.error(error);
  }
}

//kelime soru
async function fetchSimilarQuestion() {
  const book = document.getElementById('book-select').value;
  const topic = document.getElementById('topic-select').value;

  try {
    
    document.getElementById('question').innerText = "Kelime Soru: \n" + data.kelimeSoru;
  } catch (error) {
    document.getElementById('question').innerText = 'Failed to load related question.';
    console.error(error);
  }
}

async function onBookChange() {
  const kitapAdi = document.getElementById('book-select').value;
  const topic = document.getElementById('topic-select').value;

  if (topic === 'Malumat') {
    try {
      const response = await fetch('https://sifai-app.onrender.com/api/kategori', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kitapAdi }),
      });
      const subtopics = await response.json();

      // Populate subtopics dropdown
      const subtopicSelect = document.getElementById('subtopic-select');
      subtopicSelect.innerHTML = '<option value="">Select a Sub Topic</option>';
      subtopics.forEach(subtopic => {
        const option = document.createElement('option');
        option.value = subtopic._id;
        option.text = subtopic._id;
        subtopicSelect.appendChild(option);
      });

      // Show the subtopics dropdown
      document.getElementById('subtopic-group').style.display = 'block';
      document.getElementById('refresh-btn').style.display = 'none';
      document.getElementById('related-btn').style.display = 'none';
      document.getElementById('similar-btn').style.display = 'none';
    } catch (error) {
      console.error('Error fetching subtopics:', error);
    }
  } else {
    document.getElementById('subtopic-group').style.display = 'none';
    document.getElementById('refresh-btn').style.display = 'inline-block';
  }
}

function onTopicChange() {
  const topic = document.getElementById('topic-select').value;

  if (topic === 'Malumat') {
    // Hide buttons
    document.getElementById('related-btn').style.display = 'none';
    document.getElementById('similar-btn').style.display = 'none';
  } else {
    // Show button to get questions
    document.getElementById('refresh-btn').style.display = 'inline-block';
  }
}
