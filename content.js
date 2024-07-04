// async function checkSpam(emailContent) {
//   try {
//     const response = await fetch('http://127.0.0.1:5000/check_spam', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ content: emailContent })
//     });
//     const data = await response.json();
//     // return data.isSpam;
//     return data;

//   } catch (error) {
//     console.error('Error:', error);
//     return false; // Default to not spam if there's an error
//   }
// }

// async function classifyEmails() {
//   const emailElements = document.querySelectorAll('.zA .y6 span[id]');
//   for (let email of emailElements) {
//     const emailContent = email.textContent;
//     const response = await checkSpam(emailContent);
//     const isSpam=response.isSpam
//     const ham_prob=response.hamProbability
//     const spam_prob=response.spamProbability
//     console.log("is spam",isSpam)
//     console.log("ham probability",ham_prob)
//     console.log("spam probability",spam_prob)
//     if (isSpam) {
//       email.closest('.zA').style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Highlight spam emails
//     }
//   }
// }

// document.addEventListener('DOMContentLoaded', classifyEmails);

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "classifyEmails") {
//     classifyEmails().then(() => sendResponse({status: "done"}));
//     return true; // Will respond asynchronously
//   }
// });






async function checkSpam(emailContent) {
  try {
    const response = await fetch('http://127.0.0.1:5000/check_spam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: emailContent })
    });
    const data = await response.json();
    return data; // Return both isSpam and probabilities

  } catch (error) {
    console.error('Error:', error);
    return { isSpam: false, hamProbability: 0, spamProbability: 0 }; // Default values if there's an error
  }
}

async function classifyEmails() {
  const emailElements = document.querySelectorAll('.zA .y6 span[id]');
  emailElements.forEach(async (emailElement) => {
    const emailContent = emailElement.textContent.trim();
    const response = await checkSpam(emailContent);
    const isSpam = response.isSpam;
    const hamProbability = response.hamProbability;
    const spamProbability = response.spamProbability;

    // Add hover event listener to display probabilities
    emailElement.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = `
        <p>Spam Probability: ${spamProbability.toFixed(3)}%</p>
        <p>Ham Probability: ${hamProbability.toFixed(3)}%</p>
      `;
      emailElement.appendChild(tooltip);
    });

    // Remove tooltip on mouse leave
    emailElement.addEventListener('mouseleave', () => {
      const tooltip = emailElement.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });

    if (isSpam) {
      emailElement.closest('.zA').style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Highlight spam emails
    }
  });
}

document.addEventListener('DOMContentLoaded', classifyEmails);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "classifyEmails") {
    classifyEmails().then(() => sendResponse({ status: "done" }));
    return true; // Will respond asynchronously
  }
});

