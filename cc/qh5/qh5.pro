# Add more folders to ship with the application, here
folder_01.source = html
folder_01.target = .
DEPLOYMENTFOLDERS = folder_01

# Define TOUCH_OPTIMIZED_NAVIGATION for touch optimization and flicking
#DEFINES += TOUCH_OPTIMIZED_NAVIGATION

# If your application uses the Qt Mobility libraries, uncomment the following
# lines and add the respective components to the MOBILITY variable.
# CONFIG += mobility
# MOBILITY +=
QT += webkit

# The .cpp file which was generated for your project. Feel free to hack it.
SOURCES += main.cpp \
    ui/main_page.cpp
INCLUDEPATH += $$PWD

#CONFIG -= x86_64

# Please do not modify the following two lines. Required for deployment.
#include(html5applicationviewer/html5applicationviewer.pri)
#qtcAddDeployment()

HEADERS += \
    ui/main_page.h

RESOURCES += \
    webr.qrc
