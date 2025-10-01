import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClassApplication, Class, User } from '@/api/entities';
import { ExternalLink, Calendar, Clock, User as UserIcon } from 'lucide-react';

export default function MyPage() {
  const [applications, setApplications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const userApplications = await ClassApplication.filter({ email: currentUser.email }, '-created_date', 50);
      setApplications(userApplications);
      
      const classIds = userApplications.map(app => app.class_id);
      if (classIds.length > 0) {
        const classData = await Class.list();
        setClasses(classData.filter(cls => classIds.includes(cls.id)));
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <Badge variant="secondary">승인 대기</Badge>;
      case 'approved': return <Badge className="bg-green-500">승인됨</Badge>;
      case 'rejected': return <Badge variant="destructive">승인 거절</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClassInfo = (classId) => {
    return classes.find(cls => cls.id === classId) || {};
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <UserIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          </div>
          {user && (
            <p className="text-lg text-gray-600">
              안녕하세요, <span className="font-semibold">{user.full_name || user.email}</span>님!
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <h2 className="text-2xl font-bold mb-8">나의 수업 신청 내역</h2>
          
          {applications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 mb-4">아직 신청한 수업이 없습니다.</p>
                <Link to={createPageUrl("Programs")}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    수업 신청하러 가기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => {
                const classInfo = getClassInfo(application.class_id);
                return (
                  <Card key={application.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{classInfo.title || '수업 정보를 찾을 수 없습니다'}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {classInfo.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {classInfo.start_time} - {classInfo.end_time}
                          </span>
                          <Badge variant="outline">{application.level}</Badge>
                        </div>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p>담당 강사: {classInfo.teacher}</p>
                      <p>신청일: {new Date(application.created_date).toLocaleDateString()}</p>
                    </div>

                    {application.status === 'approved' && classInfo.zoom_link ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-green-800 font-semibold mb-2">🎉 수업 승인되었습니다!</p>
                        <a href={classInfo.zoom_link} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Zoom 수업 입장
                          </Button>
                        </a>
                      </div>
                    ) : application.status === 'rejected' ? (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-red-800">승인 거절되었습니다.</p>
                        <p className="text-sm text-red-600 mt-1">
                          문의: <a href="mailto:koreanyou@koreanyou.net" className="underline">koreanyou@koreanyou.net</a>
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800">관리자 승인을 기다리고 있습니다.</p>
                        <p className="text-sm text-yellow-600 mt-1">승인되면 이메일로 안내드립니다.</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}