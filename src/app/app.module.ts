import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import {SQLite} from '@ionic-native/sqlite';

// Pages
import { HomePage, ModalContentPage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SyncPage } from '../pages/sync/sync'
import { QuizPage } from '../pages/quiz/quiz'
import { AnswerPage } from '../pages/answer/answer'
import { SettingPage } from '../pages/setting/setting';
import { LoginPage } from '../pages/login/login';
import { LanguagePage} from '../pages/language/language';
import { ThankPage} from '../pages/thank/thank';
import { BoardPage, ModalTermsPage} from '../pages/board/board';
import { NoshowPage} from '../pages/noshow/noshow';
import { ChangecuponPage} from '../pages/changecupon/changecupon';
import { ChangepersonPage} from '../pages/changeperson/changeperson';
import { BoardsincuponPage} from '../pages/boardsincupon/boardsincupon';
import { DetailPage} from '../pages/detail/detail';
import { SignaturePage } from '../pages/signature/signature';
import { SheetPage } from '../pages/sheet/sheet';


//Code Scan
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

// Otros
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { HttpModule } from '../../node_modules/@angular/http';

// Providers
import { ServerProvider } from '../providers/server/server';
import { DbProvider } from '../providers/db/db';
import { GlobalProvider } from '../providers/global/global';

// Storange
import { IonicStorageModule } from '@ionic/storage';

//Signature
import {SignaturePadModule} from 'angular2-signaturepad';

// Network
import { Network} from '@ionic-native/network';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SyncPage,
    QuizPage,
    AnswerPage,
    SettingPage,
    LoginPage,
    LanguagePage,
    ThankPage,
    ModalContentPage,
    BoardPage,
    ModalTermsPage,
    NoshowPage,
    ChangecuponPage,
    ChangepersonPage,
    BoardsincuponPage,
    DetailPage,
    SignaturePage,
    SheetPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SyncPage,
    QuizPage,
    AnswerPage,
    SettingPage,
    LoginPage,
    LanguagePage,
    ThankPage,
    ModalContentPage,
    BoardPage,
    ModalTermsPage,
    NoshowPage,
    ChangecuponPage,
    ChangepersonPage,
    BoardsincuponPage,
    DetailPage,
    SignaturePage,
    SheetPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServerProvider,
    DbProvider,
    BarcodeScanner,
    Network,
    GlobalProvider
  ]
})
export class AppModule {}
