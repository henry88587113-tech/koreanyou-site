import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News as NewsEntity, Partner as PartnerEntity, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, Download, FileText, CheckCircle, AlertTriangle, XCircle,
  Eye, Trash2, Save, Loader2, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// CSV parsing utility
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {});
  });
  return { headers, rows };
};

// Validation functions
const validateNewsRow = (row) => {
  const errors = [];
  const warnings = [];
  
  if (!row.title) errors.push('제목 필수');
  if (row.title && row.title.length > 80) warnings.push('제목 80자 초과');
  if (!['공지', '블로그', '보도자료', '행사', '채용'].includes(row.category)) errors.push('카테고리 오류');
  if (row.summary && row.summary.length > 180) warnings.push('요약문 180자 초과');
  if (row.thumbnail_url && !row.thumbnail_url.startsWith('https://')) errors.push('이미지 링크 오류');
  if (row.youtube_url && !row.youtube_url.includes('youtube.com') && !row.youtube_url.includes('youtu.be')) warnings.push('유튜브 링크 확인');
  
  return {
    status: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warn' : 'ok',
    errors,
    warnings
  };
};

const validatePartnerRow = (row) => {
  const errors = [];
  const warnings = [];
  
  if (!row.name) errors.push('이름 필수');
  if (!row.logo_url) errors.push('로고 URL 필수');
  if (row.logo_url && !row.logo_url.startsWith('https://')) errors.push('로고 링크 오류');
  if (row.link_url && !row.link_url.startsWith('http')) warnings.push('웹사이트 링크 확인');
  
  return {
    status: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warn' : 'ok',
    errors,
    warnings
  };
};

const generateSlug = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-');
};

export default function AdminBulkPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  
  // News upload state
  const [newsFile, setNewsFile] = useState(null);
  const [newsParsedData, setNewsParsedData] = useState([]);
  const [selectedNewsRows, setSelectedNewsRows] = useState([]);
  const [isUploadingNews, setIsUploadingNews] = useState(false);
  
  // Partners upload state
  const [partnersFile, setPartnersFile] = useState(null);
  const [partnersParsedData, setPartnersParsedData] = useState([]);
  const [selectedPartnerRows, setSelectedPartnerRows] = useState([]);
  const [isUploadingPartners, setIsUploadingPartners] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
      } catch (error) {
        navigate(createPageUrl('Home'));
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // News CSV handlers
  const handleNewsFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setNewsFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const { rows } = parseCSV(e.target.result);
          const validatedRows = rows.map((row, index) => ({
            ...row,
            id: `temp-${index}`,
            validation: validateNewsRow(row)
          }));
          setNewsParsedData(validatedRows);
          setSelectedNewsRows(validatedRows.filter(r => r.validation.status !== 'error').map(r => r.id));
        } catch (error) {
          alert('CSV 파싱 오류: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  // Partners CSV handlers
  const handlePartnersFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setPartnersFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const { rows } = parseCSV(e.target.result);
          const validatedRows = rows.map((row, index) => ({
            ...row,
            id: `temp-${index}`,
            validation: validatePartnerRow(row)
          }));
          setPartnersParsedData(validatedRows);
          setSelectedPartnerRows(validatedRows.filter(r => r.validation.status !== 'error').map(r => r.id));
        } catch (error) {
          alert('CSV 파싱 오류: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  // Bulk upload handlers
  const handleBulkNewsUpload = async () => {
    const selectedRows = newsParsedData.filter(row => selectedNewsRows.includes(row.id));
    if (selectedRows.length === 0) return;
    
    setIsUploadingNews(true);
    try {
      const newsData = selectedRows.map(row => ({
        title: row.title,
        slug: generateSlug(row.title),
        category: row.category,
        status: row.status === '공개' ? 'published' : 'draft',
        excerpt: row.summary,
        content: row.body_md,
        image_url: row.thumbnail_url,
        youtube_url: row.youtube_url,
        tags: row.tags ? row.tags.split(',').map(t => t.trim()) : []
      }));
      
      await Promise.all(newsData.map(data => NewsEntity.create(data)));
      alert(`${selectedRows.length}개 소식이 성공적으로 등록되었습니다.`);
      setNewsParsedData([]);
      setNewsFile(null);
      setSelectedNewsRows([]);
    } catch (error) {
      console.error('Bulk upload failed:', error);
      alert('일괄 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingNews(false);
    }
  };

  const handleBulkPartnersUpload = async () => {
    const selectedRows = partnersParsedData.filter(row => selectedPartnerRows.includes(row.id));
    if (selectedRows.length === 0) return;
    
    setIsUploadingPartners(true);
    try {
      const partnersData = selectedRows.map(row => ({
        name: row.name,
        logo_url: row.logo_url,
        link_url: row.link_url,
        visible: row.visible === 'false' ? false : true,
        priority: parseInt(row.priority) || 100
      }));
      
      await Promise.all(partnersData.map(data => PartnerEntity.create(data)));
      alert(`${selectedRows.length}개 파트너가 성공적으로 등록되었습니다.`);
      setPartnersParsedData([]);
      setPartnersFile(null);
      setSelectedPartnerRows([]);
    } catch (error) {
      console.error('Bulk upload failed:', error);
      alert('일괄 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingPartners(false);
    }
  };

  // Row selection handlers
  const handleNewsRowSelect = (rowId, checked) => {
    setSelectedNewsRows(prev => 
      checked ? [...prev, rowId] : prev.filter(id => id !== rowId)
    );
  };

  const handlePartnerRowSelect = (rowId, checked) => {
    setSelectedPartnerRows(prev => 
      checked ? [...prev, rowId] : prev.filter(id => id !== rowId)
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const StatusBadge = ({ status, errors, warnings }) => {
    switch(status) {
      case 'ok': return <Badge className="bg-green-100 text-green-800">🟢 정상</Badge>;
      case 'warn': return <Badge className="bg-yellow-100 text-yellow-800" title={warnings.join(', ')}>🟡 권장사항</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800" title={errors.join(', ')}>🔴 오류</Badge>;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("AdminPostList")}>
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              관리자 페이지로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">일괄 업로드 센터</h1>
          <p className="text-gray-600 mt-2">CSV 파일을 통해 대량의 콘텐츠를 한 번에 업로드할 수 있습니다.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="news">소식 업로드</TabsTrigger>
            <TabsTrigger value="partners">파트너 업로드</TabsTrigger>
          </TabsList>

          {/* News Upload Tab */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  소식(게시글) 일괄 업로드
                </CardTitle>
                <p className="text-sm text-gray-600">CSV 업로드 → 미리보기 → 일괄 등록</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="news-csv">CSV 파일 선택</Label>
                    <Input
                      id="news-csv"
                      type="file"
                      accept=".csv"
                      onChange={handleNewsFileChange}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      필수 필드: title, category, status, summary, body_md, thumbnail_url
                    </p>
                  </div>
                  
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription>
                      <strong>CSV 템플릿:</strong> title,category,status,summary,body_md,thumbnail_url,youtube_url,tags,publish_date
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {newsParsedData.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>미리보기 ({newsParsedData.length}개 항목)</CardTitle>
                    <div className="space-x-2">
                      <Button
                        onClick={handleBulkNewsUpload}
                        disabled={selectedNewsRows.length === 0 || isUploadingNews}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUploadingNews ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        선택 등록 ({selectedNewsRows.length}개)
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">선택</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead className="w-20">썸네일</TableHead>
                          <TableHead>제목</TableHead>
                          <TableHead>카테고리</TableHead>
                          <TableHead>발행상태</TableHead>
                          <TableHead>유튜브</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newsParsedData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedNewsRows.includes(row.id)}
                                onCheckedChange={(checked) => handleNewsRowSelect(row.id, checked)}
                                disabled={row.validation.status === 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              <StatusBadge 
                                status={row.validation.status}
                                errors={row.validation.errors}
                                warnings={row.validation.warnings}
                              />
                            </TableCell>
                            <TableCell>
                              {row.thumbnail_url && (
                                <img src={row.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{row.title}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>
                              <Badge variant={row.status === '공개' ? 'default' : 'secondary'}>
                                {row.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {row.youtube_url && <Badge variant="outline">YouTube</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Partners Upload Tab */}
          <TabsContent value="partners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  파트너 로고 일괄 업로드
                </CardTitle>
                <p className="text-sm text-gray-600">CSV로 파트너사 로고/링크를 한 번에 추가</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="partners-csv">CSV 파일 선택</Label>
                    <Input
                      id="partners-csv"
                      type="file"
                      accept=".csv"
                      onChange={handlePartnersFileChange}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      필수 필드: name, logo_url
                    </p>
                  </div>
                  
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription>
                      <strong>CSV 템플릿:</strong> name,logo_url,link_url,visible,priority
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {partnersParsedData.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>미리보기 ({partnersParsedData.length}개 항목)</CardTitle>
                    <div className="space-x-2">
                      <Button
                        onClick={handleBulkPartnersUpload}
                        disabled={selectedPartnerRows.length === 0 || isUploadingPartners}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUploadingPartners ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        선택 등록 ({selectedPartnerRows.length}개)
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">선택</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead className="w-20">로고</TableHead>
                          <TableHead>이름</TableHead>
                          <TableHead>링크</TableHead>
                          <TableHead>노출</TableHead>
                          <TableHead>우선순위</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partnersParsedData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedPartnerRows.includes(row.id)}
                                onCheckedChange={(checked) => handlePartnerRowSelect(row.id, checked)}
                                disabled={row.validation.status === 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              <StatusBadge 
                                status={row.validation.status}
                                errors={row.validation.errors}
                                warnings={row.validation.warnings}
                              />
                            </TableCell>
                            <TableCell>
                              {row.logo_url && (
                                <img src={row.logo_url} alt="" className="w-16 h-10 object-contain" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>
                              {row.link_url && (
                                <a href={row.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                  링크
                                </a>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={row.visible === 'false' ? 'outline' : 'default'}>
                                {row.visible === 'false' ? '비노출' : '노출'}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.priority || '100'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}