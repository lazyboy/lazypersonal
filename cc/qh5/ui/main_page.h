#ifndef UI_MAIN_PAGE_H
#define UI_MAIN_PAGE_H

#include <QWidget>
#include <QUrl>

class QGraphicsWebView;
class MainPagePrivate;

class MainPage : public QWidget {
  Q_OBJECT

public:
  explicit MainPage(QWidget* parent = 0);
  virtual ~MainPage();

  void LoadUrl(const QUrl &url);
  void Show();
  QGraphicsWebView* webview() const;

private:
  class MainPagePrivate* private_;
};

#endif // UI_MAIN_PAGE_H
