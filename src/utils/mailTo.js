const mailTo = (
  email = process.env.REACT_APP_ADMIN_MAIL,
  subject = "[Q&A] AI Play Contact",
  body = "도움이 필요하신 내용을 남겨주세요! 가능한 한 빠르게 답변해드리겠습니다."
) => {
  let params = subject || body ? "?" : "";
  if (subject) params += `subject=${encodeURIComponent(subject)}`;
  if (body) params += `${subject ? "&" : ""}body=${encodeURIComponent(body)}`;

  return `mailto:${email}${params}`;
};

export default mailTo;
