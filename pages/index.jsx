import Layout from "./Layout.jsx";

import Home from "./Home";

import ThankYou from "./ThankYou";

import About from "./About";

import KoreanLesson from "./KoreanLesson";

import AboutOrganization from "./AboutOrganization";

import AboutLegal from "./AboutLegal";

import AboutPartners from "./AboutPartners";

import Contact from "./Contact";

import ProgramsKoreanLevels from "./ProgramsKoreanLevels";

import ProgramsAI from "./ProgramsAI";

import ProgramsExchange from "./ProgramsExchange";

import ProgramsMetaverse from "./ProgramsMetaverse";

import StudyAbroad from "./StudyAbroad";

import StudyTopik from "./StudyTopik";

import StudyVisa from "./StudyVisa";

import StudyCounsel from "./StudyCounsel";

import Impact from "./Impact";

import Participate from "./Participate";

import Donate from "./Donate";

import Volunteer from "./Volunteer";

import News from "./News";

import NewsDetail from "./NewsDetail";

import PartnerApply from "./PartnerApply";

import AdminCMS from "./AdminCMS";

import AdminPostList from "./AdminPostList";

import AdminBulk from "./AdminBulk";

import AdminGroupWrite from "./AdminGroupWrite";

import FinancialTransparency from "./FinancialTransparency";

import SiteChecklist from "./SiteChecklist";

import partners-mou from "./partners-mou";

import PartnersMOU from "./PartnersMOU";

import Programs from "./Programs";

import My from "./My";

import AdminClasses from "./AdminClasses";

import AdminApplications from "./AdminApplications";

import KoreanLevelTest from "./KoreanLevelTest";

import AdminLevelTestResults from "./AdminLevelTestResults";

import AdminQuestions from "./AdminQuestions";

import AIGameDemo from "./AIGameDemo";

import AdminReviews from "./AdminReviews";

import Reviews from "./Reviews";

import AdminAchievements from "./AdminAchievements";

import Testimonials from "./Testimonials";

import Surveys from "./Surveys";

import Achievements from "./Achievements";

import Activities from "./Activities";

import Blog from "./Blog";

import AdminBulkUpload from "./AdminBulkUpload";

import PostWidgetTest from "./PostWidgetTest";

import PostDetailTest from "./PostDetailTest";

import TestimonialDetail from "./TestimonialDetail";

import AchievementDetail from "./AchievementDetail";

import SurveyDetail from "./SurveyDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    ThankYou: ThankYou,
    
    About: About,
    
    KoreanLesson: KoreanLesson,
    
    AboutOrganization: AboutOrganization,
    
    AboutLegal: AboutLegal,
    
    AboutPartners: AboutPartners,
    
    Contact: Contact,
    
    ProgramsKoreanLevels: ProgramsKoreanLevels,
    
    ProgramsAI: ProgramsAI,
    
    ProgramsExchange: ProgramsExchange,
    
    ProgramsMetaverse: ProgramsMetaverse,
    
    StudyAbroad: StudyAbroad,
    
    StudyTopik: StudyTopik,
    
    StudyVisa: StudyVisa,
    
    StudyCounsel: StudyCounsel,
    
    Impact: Impact,
    
    Participate: Participate,
    
    Donate: Donate,
    
    Volunteer: Volunteer,
    
    News: News,
    
    NewsDetail: NewsDetail,
    
    PartnerApply: PartnerApply,
    
    AdminCMS: AdminCMS,
    
    AdminPostList: AdminPostList,
    
    AdminBulk: AdminBulk,
    
    AdminGroupWrite: AdminGroupWrite,
    
    FinancialTransparency: FinancialTransparency,
    
    SiteChecklist: SiteChecklist,
    
    partners-mou: partners-mou,
    
    PartnersMOU: PartnersMOU,
    
    Programs: Programs,
    
    My: My,
    
    AdminClasses: AdminClasses,
    
    AdminApplications: AdminApplications,
    
    KoreanLevelTest: KoreanLevelTest,
    
    AdminLevelTestResults: AdminLevelTestResults,
    
    AdminQuestions: AdminQuestions,
    
    AIGameDemo: AIGameDemo,
    
    AdminReviews: AdminReviews,
    
    Reviews: Reviews,
    
    AdminAchievements: AdminAchievements,
    
    Testimonials: Testimonials,
    
    Surveys: Surveys,
    
    Achievements: Achievements,
    
    Activities: Activities,
    
    Blog: Blog,
    
    AdminBulkUpload: AdminBulkUpload,
    
    PostWidgetTest: PostWidgetTest,
    
    PostDetailTest: PostDetailTest,
    
    TestimonialDetail: TestimonialDetail,
    
    AchievementDetail: AchievementDetail,
    
    SurveyDetail: SurveyDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/ThankYou" element={<ThankYou />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/KoreanLesson" element={<KoreanLesson />} />
                
                <Route path="/AboutOrganization" element={<AboutOrganization />} />
                
                <Route path="/AboutLegal" element={<AboutLegal />} />
                
                <Route path="/AboutPartners" element={<AboutPartners />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/ProgramsKoreanLevels" element={<ProgramsKoreanLevels />} />
                
                <Route path="/ProgramsAI" element={<ProgramsAI />} />
                
                <Route path="/ProgramsExchange" element={<ProgramsExchange />} />
                
                <Route path="/ProgramsMetaverse" element={<ProgramsMetaverse />} />
                
                <Route path="/StudyAbroad" element={<StudyAbroad />} />
                
                <Route path="/StudyTopik" element={<StudyTopik />} />
                
                <Route path="/StudyVisa" element={<StudyVisa />} />
                
                <Route path="/StudyCounsel" element={<StudyCounsel />} />
                
                <Route path="/Impact" element={<Impact />} />
                
                <Route path="/Participate" element={<Participate />} />
                
                <Route path="/Donate" element={<Donate />} />
                
                <Route path="/Volunteer" element={<Volunteer />} />
                
                <Route path="/News" element={<News />} />
                
                <Route path="/NewsDetail" element={<NewsDetail />} />
                
                <Route path="/PartnerApply" element={<PartnerApply />} />
                
                <Route path="/AdminCMS" element={<AdminCMS />} />
                
                <Route path="/AdminPostList" element={<AdminPostList />} />
                
                <Route path="/AdminBulk" element={<AdminBulk />} />
                
                <Route path="/AdminGroupWrite" element={<AdminGroupWrite />} />
                
                <Route path="/FinancialTransparency" element={<FinancialTransparency />} />
                
                <Route path="/SiteChecklist" element={<SiteChecklist />} />
                
                <Route path="/partners-mou" element={<partners-mou />} />
                
                <Route path="/PartnersMOU" element={<PartnersMOU />} />
                
                <Route path="/Programs" element={<Programs />} />
                
                <Route path="/My" element={<My />} />
                
                <Route path="/AdminClasses" element={<AdminClasses />} />
                
                <Route path="/AdminApplications" element={<AdminApplications />} />
                
                <Route path="/KoreanLevelTest" element={<KoreanLevelTest />} />
                
                <Route path="/AdminLevelTestResults" element={<AdminLevelTestResults />} />
                
                <Route path="/AdminQuestions" element={<AdminQuestions />} />
                
                <Route path="/AIGameDemo" element={<AIGameDemo />} />
                
                <Route path="/AdminReviews" element={<AdminReviews />} />
                
                <Route path="/Reviews" element={<Reviews />} />
                
                <Route path="/AdminAchievements" element={<AdminAchievements />} />
                
                <Route path="/Testimonials" element={<Testimonials />} />
                
                <Route path="/Surveys" element={<Surveys />} />
                
                <Route path="/Achievements" element={<Achievements />} />
                
                <Route path="/Activities" element={<Activities />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/AdminBulkUpload" element={<AdminBulkUpload />} />
                
                <Route path="/PostWidgetTest" element={<PostWidgetTest />} />
                
                <Route path="/PostDetailTest" element={<PostDetailTest />} />
                
                <Route path="/TestimonialDetail" element={<TestimonialDetail />} />
                
                <Route path="/AchievementDetail" element={<AchievementDetail />} />
                
                <Route path="/SurveyDetail" element={<SurveyDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}