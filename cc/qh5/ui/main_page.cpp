#include "ui/main_page.h"

#include <QCoreApplication>
#include <QDir>
#include <QFileInfo>
#include <QVBoxLayout>
#include <QGraphicsView>
#include <QGraphicsScene>
#include <QGraphicsLinearLayout>
#include <QGraphicsWebView>
#include <QWebFrame>


class MainPagePrivate : public QGraphicsView {
  Q_OBJECT
public:
  MainPagePrivate(QWidget *parent = 0);

  void resizeEvent(QResizeEvent *event);

public slots:
  void Quit();

private slots:
  void AddToJavaScript();

signals:
  void QuitRequested();

public:
  QGraphicsWebView *webview_;
};

MainPagePrivate::MainPagePrivate(QWidget *parent)
    : QGraphicsView(parent) {
  QGraphicsScene *scene = new QGraphicsScene;
  setScene(scene);
  setFrameShape(QFrame::NoFrame);
  setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

  webview_ = new QGraphicsWebView;
  webview_->setAcceptTouchEvents(true);
  webview_->setAcceptHoverEvents(false);
  setAttribute(Qt::WA_AcceptTouchEvents, true);
  scene->addItem(webview_);
  scene->setActiveWindow(webview_);
  connect(webview_->page()->mainFrame(),
          SIGNAL(javaScriptWindowObjectCleared()),
          SLOT(AddToJavaScript()));
}

void MainPagePrivate::resizeEvent(QResizeEvent *event) {
  webview_->resize(event->size());
}

void MainPagePrivate::Quit() {
  emit QuitRequested();
}

void MainPagePrivate::AddToJavaScript() {
  webview_->page()->mainFrame()->addToJavaScriptWindowObject("Qt", this);
}

MainPage::MainPage(QWidget *parent)
    : QWidget(parent), private_(new MainPagePrivate(this)) {
  connect(private_, SIGNAL(QuitRequested()), SLOT(close()));
  QVBoxLayout *layout = new QVBoxLayout;
  layout->addWidget(private_);
  layout->setMargin(0);
  setLayout(layout);
}

MainPage::~MainPage() {
  delete private_;
}

void MainPage::LoadUrl(const QUrl &url) {
  private_->webview_->setUrl(url);
}

void MainPage::Show() {
  show();
}

QGraphicsWebView* MainPage::webview() const {
  return private_->webview_;
}

#include "main_page.moc"
