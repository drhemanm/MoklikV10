exports.handler = async (event, context) => {
  const response = await fetch('https://api.openai.com/v1/assistants/asst_gGOP7TnOmuzW6yrkDaE7jmWa/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: event.body
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(await response.json())
  };
};
