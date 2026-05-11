export default function SectionCard({ title, children }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      marginTop: "20px"
    }}>
      <h3 style={{ marginBottom: "15px" }}>{title}</h3>
      {children}
    </div>
  );
}