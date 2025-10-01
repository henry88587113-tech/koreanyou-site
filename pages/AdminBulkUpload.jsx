
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News as NewsEntity, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Upload, Download, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const CSV_HEADERS = [
    "category", "title", "summary", "thumbnail_url", "youtube_url",
    "tags", "status", "publish_at", "body"
];

const CATEGORIES = [
    "기관 소개", "학습자 후기", "설문결과 하이라이트", "실제 학습 성과 인증",
    "활동 사례", "공지", "소식", "기타"
];

export default function AdminBulkUploadPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useState(() => {
        User.me().catch(() => navigate(createPageUrl('Home')));
    }, [navigate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };
    
    const parseCSV = (csvFile) => {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split(/\r\n|\n/);
            const headers = lines[0].split(',').map(h => h.trim());
            
            if (JSON.stringify(headers) !== JSON.stringify(CSV_HEADERS)) {
                 alert("CSV 헤더가 템플릿과 일치하지 않습니다. 템플릿을 다운로드하여 사용해주세요.");
                 setIsProcessing(false);
                 setFile(null);
                 return;
            }

            const data = [];
            const validationErrors = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i]) continue;
                const values = lines[i].split(',');
                const row = headers.reduce((obj, header, index) => {
                    obj[header] = values[index] ? values[index].trim() : '';
                    return obj;
                }, {});

                // Validation
                const rowErrors = [];
                if (!row.title) rowErrors.push("제목 필수");
                if (!row.category || !CATEGORIES.includes(row.category)) rowErrors.push("유효하지 않은 카테고리");
                if (row.status && !['draft', 'published', 'review_requested'].includes(row.status)) rowErrors.push("유효하지 않은 상태");
                
                if (rowErrors.length > 0) {
                    validationErrors.push({ row: i + 1, messages: rowErrors });
                }
                data.push(row);
            }
            setParsedData(data);
            setErrors(validationErrors);
            setIsProcessing(false);
        };
        reader.readAsText(csvFile, 'UTF-8');
    };

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8," + CSV_HEADERS.join(',');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "koreanclick_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async () => {
        if (errors.length > 0) {
            alert('오류가 있는 항목이 있습니다. 수정 후 다시 시도해주세요.');
            return;
        }
        if (parsedData.length === 0) {
            alert('업로드할 데이터가 없습니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            await NewsEntity.bulkCreate(parsedData);
            alert(`${parsedData.length}개의 항목이 성공적으로 업로드되었습니다.`);
            setFile(null);
            setParsedData([]);
            setErrors([]);
        } catch (error) {
            console.error("Bulk create failed:", error);
            alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const getRowError = (rowIndex) => {
        return errors.find(err => err.row === rowIndex + 2);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">콘텐츠 일괄 업로드</h1>
                    <Link to={createPageUrl("AdminPostList")}>
                        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> 목록으로</Button>
                    </Link>
                </div>
            </header>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1. CSV 파일 업로드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        CSV 템플릿을 다운로드하여 내용을 채운 후 업로드해주세요. 모든 필드는 쉼표(,)로 구분됩니다.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={downloadTemplate} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            템플릿 다운로드
                        </Button>
                        <Button asChild variant="outline">
                            <label htmlFor="csv-upload" className="cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                CSV 파일 선택
                            </label>
                        </Button>
                        <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleFileChange} />
                    </div>
                    {file && <p className="text-sm font-medium">선택된 파일: {file.name}</p>}
                </CardContent>
            </Card>

            {(isProcessing || parsedData.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle>2. 미리보기 및 검증</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isProcessing ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>행</TableHead>
                                            <TableHead>상태</TableHead>
                                            {CSV_HEADERS.map(h => <TableHead key={h}>{h}</TableHead>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsedData.map((row, index) => {
                                            const error = getRowError(index);
                                            return (
                                                <TableRow key={index} className={error ? 'bg-red-50' : ''}>
                                                    <TableCell>{index + 2}</TableCell>
                                                    <TableCell>
                                                        {error ? (
                                                            <Badge variant="destructive" className="flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3"/> 오류
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3"/> 정상
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    {CSV_HEADERS.map(h => <TableCell key={h} className="text-xs max-w-[150px] truncate">{row[h]}</TableCell>)}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                </div>
                                {errors.length > 0 && (
                                    <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg">
                                        <h3 className="font-bold text-red-800">오류 요약</h3>
                                        <ul className="text-sm text-red-700 list-disc pl-5 mt-2">
                                            {errors.map(e => <li key={e.row}>{e.row}행: {e.messages.join(', ')}</li>)}
                                        </ul>
                                    </div>
                                )}
                                <div className="mt-6 flex justify-end">
                                    <Button onClick={handleSubmit} disabled={isSubmitting || errors.length > 0}>
                                        {isSubmitting ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 업로드 중...</>
                                        ) : (
                                            `✅ ${parsedData.length}개 항목 업로드`
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
