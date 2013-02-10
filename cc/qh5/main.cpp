#include <QApplication>
#include "ui/main_page.h"

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    MainPage main_page;
    main_page.Show();
    main_page.LoadUrl(QUrl("qrc:/html/index.html"));
    main_page.setMinimumSize(400, 300);

    return app.exec();
}
