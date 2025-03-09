exports.handler = async (event) => {
  const user = event.context.clientContext.user;
  
  if (!user || !user.app_metadata.roles.includes('admin')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Authorized" })
  };
};
