
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClassApplication, Class, User } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        loadData();
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [appData, classData] = await Promise.all([
        ClassApplication.list('-created_date', 100),
        Class.list()
      ]);
      setApplications(appData);
      setClasses(classData);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getClassInfo = (classId) => {
    return classes.find(cls => cls.id === classId) || {};
  };

  const handleApprove = async (application) => {
    try {
      await ClassApplication.update(application.id, { status: 'approved' });
      
      const classInfo = getClassInfo(application.class_id);
      await SendEmail({
        to: application.email,
        subject: '[코리언클릭] 한국어 수업 승인 안내',
        body: `
안녕하세요 ${application.name}님,

코리언클릭 한국어 수업 신청이 승인되었습니다!

📚 수업 정보:
- 수업명: ${classInfo.title}
- 레벨: ${application.level}
- 날짜: ${classInfo.date}
- 시간: ${classInfo.start_time} - ${classInfo.end_time}
- 담당 강사: ${classInfo.teacher}

🔗 마이페이지에서 Zoom 링크 확인:
${window.location.origin}/my

질문이 있으시면 언제든 연락주세요.

감사합니다.
코리언클릭 국제교육원
        `
      });

      loadData();
      alert('승인 완료되었습니다. 신청자에게 이메일이 발송되었습니다.');
    } catch (error) {
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (application) => {
    const reason = prompt('거절 사유를 입력하세요 (선택사항):');
    try {
      await ClassApplication.update(application.id, { status: 'rejected' });
      
      await SendEmail({
        to: application.email,
        subject: '[코리언클릭] 한국어 수업 신청 결과 안내',
        body: `
안녕하세요 ${application.name}님,

아쉽게도 이번 한국어 수업 신청이 승인되지 않았습니다.

${reason ? `사유: ${reason}` : ''}

다른 수업이나 문의사항이 있으시면 언제든 연락주세요.
이메일: koreanyou@koreanyou.net

감사합니다.
코리언클릭 국제교육원
        `
      });

      loadData();
      alert('거절 처리가 완료되었습니다.');
    } catch (error) {
      alert('거절 처리 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <Badge variant="secondary">대기중</Badge>;
      case 'approved': return <Badge className="bg-green-500">승인됨</Badge>;
      case 'rejected': return <Badge variant="destructive">거절됨</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">수업 신청 관리</h1>
        <p className="text-gray-600 mt-2">학생들의 수업 신청을 승인하거나 거절할 수 있습니다.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>신청 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>신청자</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>국가</TableHead>
                  <TableHead>레벨</TableHead>
                  <TableHead>수업</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const classInfo = getClassInfo(app.class_id);
                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-gray-500">{app.language_preference}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{app.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{app.country}</TableCell>
                      <TableCell>{app.level}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{classInfo.title}</div>
                          <div className="text-gray-500">
                            {classInfo.date} {classInfo.start_time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(app.status)}
                      </TableCell>
                      <TableCell>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(app)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(app)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
