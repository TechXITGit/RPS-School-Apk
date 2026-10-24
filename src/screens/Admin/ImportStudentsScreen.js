// Bulk Student Import Screen supporting CSV file paste, parsing, preview and duplicate detection
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { parseCSV, validateStudentRows } from '../../utils/csvParser';
import { batchImportStudents, getAllStudents } from '../../services/firebase/studentService';
import { formatINR } from '../../utils/currencyUtils';

const SAMPLE_CSV = `UID,Name,Parent Name,Phone,Email,Class,Section,Total Fee,Paid Fee,Transport,Address
RPS-101,Aarav Singh,Vikram Singh,9876543210,aarav@gmail.com,1-A,A,25000,5000,Yes,Civil Lines Deoria
RPS-102,Diya Patel,Ramesh Patel,9876543211,diya@gmail.com,1-A,A,25000,0,No,Kashipuram Colony
RPS-103,Vivaan Verma,Sunil Verma,9876543212,vivaan@gmail.com,2-A,A,28000,10000,Yes,Rudrapur Road`;

export default function ImportStudentsScreen({ onImportSuccess }) {
  const [csvContent, setCsvContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [importSummary, setImportSummary] = useState(null);

  const handlePickFile = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,text/csv,text/plain';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        setSelectedFileName(file.name);
        setSelectedFileSize((file.size / 1024).toFixed(1) + ' KB');
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setCsvContent(content);
          setValidationResult(null);
          setImportSummary(null);
        };
        reader.onerror = () => {
          Alert.alert('Error', 'Failed to read the selected file.');
        };
        reader.readAsText(file);
      };
      input.click();
    } else {
      Alert.alert(
        'CSV Import',
        'Please paste your CSV rows into the text area below or use the web dashboard to choose a .csv file directly.'
      );
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setSelectedFileName('');
    setSelectedFileSize('');
    setValidationResult(null);
    setImportSummary(null);
  };

  const handleParseAndValidate = async () => {
    if (!csvContent.trim()) {
      Alert.alert('Empty Input', 'Please upload a CSV file or paste data first.');
      return;
    }

    setIsProcessing(true);
    setImportSummary(null);

    try {
      // 1. Fetch existing student UIDs from Firestore to detect real-time duplicates
      const existing = await getAllStudents();
      const existingUids = new Set(existing.map((s) => s.uid));

      // 2. Parse CSV
      const { rows } = parseCSV(csvContent);

      // 3. Validate
      const result = validateStudentRows(rows, existingUids);
      setValidationResult(result);
    } catch (err) {
      Alert.alert('Parsing Error', err.message || 'Could not parse CSV content.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationResult || validationResult.validRows.length === 0) {
      Alert.alert('No Valid Rows', 'There are no valid student rows ready for import.');
      return;
    }

    setIsProcessing(true);
    try {
      const { count } = await batchImportStudents(validationResult.validRows);
      setImportSummary({
        total: validationResult.totalRows,
        imported: count,
        duplicates: validationResult.duplicateRows.length,
        invalid: validationResult.invalidRows.length,
      });
      setValidationResult(null);
      setCsvContent('');
      setSelectedFileName('');
      setSelectedFileSize('');
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      Alert.alert('Import Failed', err.message || 'Failed to save students to database.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV);
    setSelectedFileName('sample_students_data.csv');
    setSelectedFileSize('1.2 KB');
    setValidationResult(null);
    setImportSummary(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, minWidth: 220 }}>
          <Text style={styles.title}>Bulk Import Students</Text>
          <Text style={styles.subtitle}>
            Upload a .csv file or paste records with UID, Name, Parent, Class & Fee details
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.uploadBtn} onPress={handlePickFile} activeOpacity={0.85}>
            <Ionicons name="cloud-upload" size={16} color="#FFFFFF" />
            <Text style={styles.uploadBtnText}>Upload CSV File</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sampleBtn} onPress={handleLoadSample} activeOpacity={0.85}>
            <Ionicons name="document-text-outline" size={16} color="#4361EE" />
            <Text style={styles.sampleBtnText}>Sample CSV</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Import Success Banner */}
      {importSummary && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={28} color="#21A572" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.successTitle}>Import Complete!</Text>
            <Text style={styles.successText}>
              Successfully imported {importSummary.imported} students into the directory.
              {importSummary.duplicates > 0 ? ` (${importSummary.duplicates} duplicate UIDs skipped)` : ''}
            </Text>
          </View>
        </View>
      )}

      {/* CSV Input Area */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>CSV Content / File Records</Text>
          <TouchableOpacity onPress={handlePickFile} style={styles.cardPickLink} activeOpacity={0.7}>
            <Ionicons name="attach" size={15} color="#5E17EB" />
            <Text style={styles.cardPickLinkText}>Choose File (.csv)</Text>
          </TouchableOpacity>
        </View>

        {selectedFileName ? (
          <View style={styles.fileSelectedBar}>
            <View style={styles.fileSelectedLeft}>
              <View style={styles.fileIconWrap}>
                <Ionicons name="document-attach" size={16} color="#5E17EB" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.fileNameText} numberOfLines={1}>
                  {selectedFileName}
                </Text>
                {selectedFileSize ? (
                  <Text style={styles.fileSizeText}>{selectedFileSize}</Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity style={styles.fileRemoveBtn} onPress={handleClear} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color="#991B1B" />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={styles.textArea}
          value={csvContent}
          onChangeText={(val) => {
            setCsvContent(val);
            if (!val) {
              setSelectedFileName('');
              setSelectedFileSize('');
            }
          }}
          placeholder="UID,Name,Parent Name,Phone,Email,Class,Section,Total Fee,Paid Fee,Transport,Address..."
          placeholderTextColor="#A199A3"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <View style={styles.inputActions}>
          {csvContent ? (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.7}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.validateBtn, isProcessing && { opacity: 0.7 }]}
            onPress={handleParseAndValidate}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="scan-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.validateBtnText}>Validate & Preview Records</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Validation & Preview Metrics */}
      {validationResult && (
        <View style={styles.previewSection}>
          <View style={styles.metricBadges}>
            <View style={[styles.metricCard, { backgroundColor: '#EEF2FF' }]}>
              <Text style={styles.metricNum}>{validationResult.totalRows}</Text>
              <Text style={styles.metricLbl}>Total Rows</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: '#E6F4EA' }]}>
              <Text style={[styles.metricNum, { color: '#21A572' }]}>
                {validationResult.validRows.length}
              </Text>
              <Text style={styles.metricLbl}>Valid Rows</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: '#FEF7E0' }]}>
              <Text style={[styles.metricNum, { color: '#EAA315' }]}>
                {validationResult.duplicateRows.length}
              </Text>
              <Text style={styles.metricLbl}>Duplicates</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: '#FDE8E8' }]}>
              <Text style={[styles.metricNum, { color: '#E53935' }]}>
                {validationResult.invalidRows.length}
              </Text>
              <Text style={styles.metricLbl}>Invalid Rows</Text>
            </View>
          </View>

          {/* Preview Table */}
          <Text style={styles.previewTitle}>Validation Preview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.previewTable}>
              <View style={styles.previewHeaderRow}>
                <Text style={[styles.pth, { width: 100 }]}>UID</Text>
                <Text style={[styles.pth, { width: 140 }]}>NAME</Text>
                <Text style={[styles.pth, { width: 70 }]}>CLASS</Text>
                <Text style={[styles.pth, { width: 90 }]}>TOTAL FEE</Text>
                <Text style={[styles.pth, { width: 90 }]}>PAID FEE</Text>
                <Text style={[styles.pth, { width: 100 }]}>STATUS</Text>
              </View>

              {validationResult.validRows.map((row, idx) => (
                <View key={`v-${idx}`} style={styles.previewRow}>
                  <Text style={[styles.ptd, { width: 100, fontWeight: '700', color: '#4361EE' }]}>{row.uid}</Text>
                  <Text style={[styles.ptd, { width: 140, fontWeight: '700' }]}>{row.name}</Text>
                  <Text style={[styles.ptd, { width: 70 }]}>{row.class}</Text>
                  <Text style={[styles.ptd, { width: 90 }]}>{formatINR(row.totalFee)}</Text>
                  <Text style={[styles.ptd, { width: 90, color: '#21A572', fontWeight: '700' }]}>{formatINR(row.paidFee)}</Text>
                  <View style={{ width: 100 }}>
                    <Text style={styles.readyBadge}>Ready</Text>
                  </View>
                </View>
              ))}

              {validationResult.duplicateRows.map((row, idx) => (
                <View key={`d-${idx}`} style={[styles.previewRow, { backgroundColor: '#FFFDF0' }]}>
                  <Text style={[styles.ptd, { width: 100, color: '#EAA315' }]}>{row.uid || '-'}</Text>
                  <Text style={[styles.ptd, { width: 140 }]}>{row.name || '-'}</Text>
                  <Text style={[styles.ptd, { width: 70 }]}>{row.class || '-'}</Text>
                  <Text style={[styles.ptd, { width: 90 }]}>-</Text>
                  <Text style={[styles.ptd, { width: 90 }]}>-</Text>
                  <View style={{ width: 100 }}>
                    <Text style={styles.dupBadge}>Duplicate UID</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Confirm Import Button */}
          {validationResult.validRows.length > 0 && (
            <TouchableOpacity
              style={[styles.confirmBtn, isProcessing && { opacity: 0.7 }]}
              onPress={handleConfirmImport}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.confirmBtnText}>
                    Confirm & Save {validationResult.validRows.length} Students to Database
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#8A7B8E',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#5E17EB',
    paddingHorizontal: 14,
    paddingVertical: 8.5,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  uploadBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 8.5,
    borderRadius: Radius.md,
  },
  sampleBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4361EE',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(33, 165, 114, 0.25)',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#166534',
  },
  successText: {
    fontSize: 12.5,
    color: '#214F37',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B1C1A',
  },
  cardPickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  cardPickLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5E17EB',
  },
  fileSelectedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  fileSelectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  fileIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#581C87',
  },
  fileSizeText: {
    fontSize: 11,
    color: '#7E22CE',
  },
  fileRemoveBtn: {
    padding: 4,
    marginLeft: 6,
  },
  textArea: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E4DDE6',
    borderRadius: 12,
    padding: 12,
    fontSize: 12.5,
    color: '#1B1C1A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    height: 120,
    marginBottom: 14,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radius.md,
    backgroundColor: '#F3F4F6',
  },
  clearBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  validateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
  },
  validateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
    marginBottom: 24,
  },
  metricBadges: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  metricLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B5A72',
    marginTop: 2,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B1C1A',
    marginBottom: 10,
  },
  previewTable: {
    minWidth: 600,
    borderWidth: 1,
    borderColor: '#EDE8F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FC',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8F0',
  },
  pth: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A7B8E',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0F7',
  },
  ptd: {
    fontSize: 12,
    color: '#1B1C1A',
  },
  readyBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#166534',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  dupBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#8A6300',
    backgroundColor: '#FEF7E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21A572',
    paddingVertical: 13,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
