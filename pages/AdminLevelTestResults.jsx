import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LevelTest, User } from '@/api/entities';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AdminLevelTestResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        const data = await LevelTest.list('-created_date', 100);
        setResults(data);
      } catch (error) {
        console.error("Authentication or data loading failed:", error);
        navigate(createPageUrl('Home'));
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">레벨 테스트 결과</h1>
            <Link to={createPageUrl("AdminPostList")}>
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    관리자 홈
                </Button>
            </Link>
        </div>
      </header>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>최근 100개 응답</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>응시일</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>최종 레벨</TableHead>
                  <TableHead className="text-right">점수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{format(new Date(result.created_date), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{result.user_name}</TableCell>
                    <TableCell>{result.user_email}</TableCell>
                    <TableCell>{result.final_level}</TableCell>
                    <TableCell className="text-right">{result.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}