-- Need to cleanup, this is almost a straight copy from xmonad site's example.
-- Original:
-- http://www.haskell.org/haskellwiki/Xmonad/Config_archive/k6b_%28kyle%27s%29_xmonad.hs
-- TODO: Clean this up!
import XMonad
import XMonad.Hooks.DynamicLog
import XMonad.Hooks.ManageDocks
import XMonad.Hooks.ManageHelpers
import XMonad.Util.Run(spawnPipe)
import XMonad.Util.EZConfig(additionalKeys)
import XMonad.Layout.IM
import XMonad.Layout.PerWorkspace
import XMonad.Layout.Reflect
import XMonad.Layout.Grid
import XMonad.Prompt
import XMonad.Prompt.Man
import System.IO
 
myTerminal = "urxvt" --my preferred terminal
myWorkspaces = ["w0rk","browser","xTra","4","5","6","7","8","9"] --list of tag names

myManageHook = composeAll
    [ className =? "vlc"        --> doFloat --float mplayer
    , className =? "Gimp"           --> doShift ".42." --move gimp to window
    , className =? "Keepassx"       --> doCenterFloat --float keepassx
    , className =? "Firefox"        --> doShift "Panic!" --move firefox to window
    , className =? "feh"            --> doCenterFloat --center and float feh
    ]

myLayoutHook = onWorkspace ".42." gimp $ onWorkspace "Don't" terminalLayout $ onWorkspace "Panic!" webLayout $ standardLayout --per workspace layouts
    where
        standardLayout = avoidStruts ( Mirror tall ||| tall ||| Grid ||| Full ) --layout to use on every other workspace
            where
                tall = Tall nmaster delta ratio --define tall layout sizes
                nmaster = 1 --number of windows in master pane
                ratio = 1/2 --ratio of master pane size
                delta = 2/100
 
        gimp =  avoidStruts $ --layout for gimp
                withIM (0.11) (Role "gimp-toolbox") $ --toolbox on side
                reflectHoriz $
                withIM (0.15) (Role "gimp-dock") Full --dock on side
        terminalLayout = avoidStruts $ Grid --layout for terminal windows
        webLayout = avoidStruts $ Mirror tall --layout for browser and terminal window
            where
                tall = Tall nmaster delta ratio --define tall layout sizes 
                nmaster = 1 --number of windows in master pane1
                ratio = 3/4 --ratio of master pane size 
                delta = 2/100

--xmobar config
myLogHook h = dynamicLogWithPP xmobarPP
            { ppHidden = xmobarColor "grey" "" --tag color
            , ppOutput = hPutStrLn h           --tag list and window title
            , ppTitle = xmobarColor "green" "" --window title color
            }

myStatusBar = "xmobar" --define first xmobar
myStartupHook :: X ()
myStartupHook = do
            spawn "xmobar ~/.xmobarrc_bottom" --start second xmobar

main = do
    din <- spawnPipe myStatusBar
    xmonad $ defaultConfig
        { manageHook = manageDocks <+> myManageHook <+> manageHook defaultConfig
        , layoutHook = myLayoutHook
        , logHook = myLogHook din
        , startupHook = myStartupHook
        , terminal = myTerminal
        , workspaces = myWorkspaces
        , modMask = mod4Mask
        }
        ----} `additionalKeys`
        ----[ ((mod4Mask, xK_f),    spawn "firefox") --start firefox
        ----, ((mod4Mask, xK_F11),  spawn "sudo /sbin/reboot") --reboot
        ----, ((mod4Mask, xK_F12),  spawn "sudo /sbin/shutdown -h now") --shutdown
        ----, ((mod4Mask, xK_p),    spawn "dmenu_run -nb black -nf white") --call dmenu
        ----, ((mod4Mask .|. shiftMask, xK_h), spawn "feh --scale ~/pictures/Xmbindings.png") --keymask dialog
        ----, ((mod4Mask, xK_F1),   manPrompt defaultXPConfig) --man prompt
        ----, ((0, xK_Print),       spawn "'scrot' -e 'mv $f ~/pictures/screenshots'") --take screenshot
        -------Media Keys
        ----, ((0, 0x1008ff13),     spawn "amixer -q set Master 2dB+") --raise sound
        ----, ((0, 0x1008ff11),     spawn "amixer -q set Master 1dB-") --lower sound
        ----, ((0, 0x1008ff12),     spawn "amixer -q set Master toggle") --mute sound
        ----, ((0, 0x1008ff2c),     spawn "eject") --eject cd
        ----]
