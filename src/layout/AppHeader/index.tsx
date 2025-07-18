import { useContext } from 'react'
import { useFullscreen } from 'ahooks'

import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Tooltip } from 'antd'
import { userStore } from '@/store/user'
import { AppLayoutContext } from '@/layout'
import { settingStore } from '@/store/setting'

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '退出登录',
  },
]
export default function AppHeader({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (e: boolean) => void }) {
  const { userInfo } = userStore()
  const { isDark, toggleDark, locale, setLocale } = settingStore()
  const { refresh } = useContext(AppLayoutContext)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)

  function onDropdownClick({ key }: any) {
    if (key === '1') {
      window.localStorage.clear()
      window.location.reload()
    }
  }
  return (
    <div className="h-[60px] flex items-center justify-between px-[20px]">
      <div
        className={`cursor-pointer  text-[18px] ${`${collapsed ? 'icon-[bi--text-indent-left]' : 'icon-[bi--text-indent-right]'}`}`}
        onClick={() => setCollapsed(!collapsed)}
      />
      <div className="ml-auto flex items-center justify-around w-0 overflow-hidden md:w-auto md:overflow-visible md-px-[25px]">
        <Tooltip title={locale}>
          <div
            className="icon-[bi--arrow-left-right] ml-[20px] cursor-pointer transition-all hover:scale-[1.2]"
            onClick={() => setLocale(locale === 'zh-cn' ? 'en' : 'zh-cn')}
          >
          </div>
        </Tooltip>
        <div
          className="icon-[bi--github] ml-[20px] cursor-pointer transition-all hover:scale-[1.2]"
          onClick={() => window.open('https://github.com/mz-dfhp/React-Admin')}
        >
        </div>
        <div
          className={`${isFullscreen ? 'icon-[bi--fullscreen-exit]' : 'icon-[bi--arrows-angle-expand]'}  ml-[20px]  cursor-pointer hover:scale-[1.2] transition-all`}
          onClick={toggleFullscreen}
        >
        </div>
        <div
          className={`${isDark ? 'icon-[bi--moon]' : 'icon-[bi--sun]'}  ml-[20px]  cursor-pointer hover:scale-[1.2] transition-all`}
          onClick={toggleDark}
        >
        </div>
        <div
          className="icon-[bi--arrow-repeat] ml-[20px] cursor-pointer text-[16px] transition-all hover:scale-[1.2]"
          onClick={refresh}
        >
        </div>
      </div>
      <div>
        <Dropdown
          menu={{ items, onClick: onDropdownClick }}
          placement="bottom"
        >
          <div className="h-[40px] flex items-center justify-center cursor-pointer rounded-[8px] px-[5px] hover:bg-gray-100">
            <span className="mr-[10px]">{userInfo.username || '-'}</span>
            <a onClick={e => e.preventDefault()}>
              <Avatar size={30} src={userInfo.avatar} />
            </a>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}
