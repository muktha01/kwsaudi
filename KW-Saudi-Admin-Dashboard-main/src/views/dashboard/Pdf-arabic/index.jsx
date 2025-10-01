// This file is intentionally left blank. See index.jsx for the actual component implementation.'use client';
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
    Divider,
     Card,
     CardContent,
     Chip,
  CircularProgress,
} from "@mui/material";

export default function PdfManager() {
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [emails, setEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  // Fetch emails of users who downloaded PDFs
  const fetchEmails = async () => {
    setEmailsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/emails-arabic`);
      const data = await res.json();
      setEmails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEmails([]);
    } finally {
      setEmailsLoading(false);
    }
  };

  // Define the PDF types we want to manage
  const pdfTypes = [
    { name: "How to Sell Your Home-Arabic", title: "How to Sell Your Home" },
    { name: "How to Buy a Home-Arabic", title: "How to Buy a Home" }
  ];

  // Fetch list of PDFs from backend
  const fetchPdfs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pdf-arabic`);
      const data = await res.json();
      setPdfs(Array.isArray(data) ? data : []); // fallback to []
    } catch (err) {
      console.error(err);
      alert("Failed to load PDFs");
      setPdfs([]);
    }
  };

  useEffect(() => {
    fetchPdfs();
    fetchEmails();
  }, []);

  // Check if a PDF exists in the database
  const getPdfData = (pdfName) => {
    return pdfs.find(pdf => pdf.name === pdfName);
  };

  // Handle upload
  const handleUpload = async (e, pdfName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("name", pdfName);

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Uploaded!");
      fetchPdfs(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (pdfName) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/downloads/${pdfName}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${pdfName}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Paper sx={{ p: 4, maxWidth: 600, margin: "0 auto" }}>
        <Typography variant="h4" mb={3}>
          PDF Manager
        </Typography>

        <Stack spacing={6}>
          {pdfTypes.map((pdfType) => {
            const existingPdf = getPdfData(pdfType.name);
            return (
              <Box key={pdfType.name}>
                <Typography variant="h6" pb={2}>
                  {pdfType.title}
                  {existingPdf && (
                    <Typography variant="body2" color="green" component="span" ml={2}>
                      ✓ Uploaded
                    </Typography>
                  )}
                </Typography>

                <Stack spacing={2} direction="row">
                  <Button
                    variant="contained"
                    component="label"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : `Upload ${pdfType.title}`}
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => handleUpload(e, pdfType.name)}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleDownload(pdfType.name)}
                    disabled={loading || !existingPdf}
                  >
                    {loading ? <CircularProgress size={20} /> : `Download ${pdfType.title}`}
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* Emails Section */}
     <Paper
  elevation={3}
  sx={{
    p: 4,
    maxWidth: 700,
    margin: "32px auto 0 auto",
    borderRadius: 3,
    bgcolor: "background.paper",
  }}
>
<Typography variant="h5" fontWeight="600" gutterBottom>
  📩 Emails of Users Who Downloaded PDFs
</Typography>
<Divider sx={{ mb: 3 }} />

{emailsLoading ? (
  <Box display="flex" justifyContent="center" alignItems="center" py={4}>
    <CircularProgress />
  </Box>
) : emails.length === 0 ? (
  <Typography align="center" color="text.secondary">
    No emails found.
  </Typography>
) : (
  <>
    {pdfTypes.map((pdfType) => {
      const filteredEmails = emails.filter(
        (e) => e.pdfName === pdfType.name
      );
      return (
        <Card
          key={pdfType.name}
          variant="outlined"
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="500">
              {pdfType.title}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {filteredEmails.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
                align="center"
              >
                No downloads yet.
              </Typography>
            ) : (
              <Stack spacing={1} alignItems="center">
                {filteredEmails.map((e, idx) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    key={idx}
                    sx={{ width: "100%" }}
                  >
                    <Chip
                      label={e.email}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={async () => {
                        if (!window.confirm("Delete this email?")) return;
                        setLoading(true);
                        try {
                          const res = await fetch(
                            `${import.meta.env.VITE_API_URL}/emails-arabic`,
                            {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                email: e.email,
                                pdfName: pdfType.name,
                                date: e.date,
                              }),
                            }
                          );
                          if (!res.ok) throw new Error("Delete failed");
                          fetchEmails();
                        } catch (err) {
                          alert("Delete failed");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      );
    })}
  </>
)}

</Paper>
    </Box>
  );
}
