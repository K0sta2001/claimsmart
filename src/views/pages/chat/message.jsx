export default function Message({ prompt, isFromClient }) {
  return (
    <>
      <div id="message" className={isFromClient ? "client-message" : ""}>
        {prompt}
      </div>
    </>
  );
}
