import React, { useContext, useEffect, useMemo, useState } from 'react'
import type { MenuProps } from 'antd'
import { Dropdown, Tabs } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { tabsStore } from '@/store/tabs'
import { routerStore } from '@/store/router'
import { AppLayoutContext } from '@/layout'
import '@/layout/AppTabs/index.scss'

const operateList = [
  { id: 1, title: '刷新当前', icon: 'icon-[bi--arrow-repeat]' },
  { id: 2, title: '关闭当前', icon: 'icon-[bi--x-lg]' },
  { id: 3, title: '关闭其他', icon: 'icon-[bi--x-lg]' },
  { id: 4, title: '关闭左侧', icon: 'icon-[bi--arrow-left-circle]' },
  { id: 5, title: '关闭右侧', icon: 'icon-[bi--arrow-right-circle]' },
  { id: 6, title: '关闭全部', icon: 'icon-[bi--x-lg]' },
]
const AppTabs: React.FC = () => {
  const ROOT_INDEX = '/aindex';
  const location = useLocation()
  const navigate = useNavigate()
  const { tabsList, addTabs, closeCurrentTabs, closeOtherTabs, closeLeftTabs, closeRightTabs, closeAllTabs } = tabsStore()
  const { routerList } = routerStore()
  const [activeKey, setActiveKey] = useState('')
  const { refresh } = useContext(AppLayoutContext)

  function onEdit(key: any) {
    const index = tabsList.findIndex(item => item.key === key)
    closeCurrentTabs(key)
    const navigateIndex = index + (tabsList.length - 1 === index ? -1 : 1)
    navigate(tabsList[navigateIndex].key, { replace: true })
  }

  function onDropdownClick({ key }: any) {
    switch (+key) {
      case 1:
        refresh()
        break
      case 2:
        onEdit(activeKey)
        break
      case 3:
        closeOtherTabs(activeKey)
        break
      case 4:
        closeLeftTabs(activeKey)
        break
      case 5:
        closeRightTabs(activeKey)
        break
      case 6:
        navigate(ROOT_INDEX)
        closeAllTabs()
        break
      default:
        break
    }
  }

  const dropdownList: MenuProps['items'] = useMemo(() => {
    function operateDisabled(e: number) {
      const findIndex = tabsList.findIndex(
        item => item.key === activeKey,
      )
      switch (e) {
        case 1:
          return false
        case 2:
          return ROOT_INDEX === activeKey
        case 3:
          return tabsList.length === 2 || tabsList.length === 1
        case 4:
          return !(findIndex > 1)
        case 5:
          return !(tabsList.length > findIndex + 1)
        case 6:
          return tabsList.length <= 1
        default:
          return false
      }
    }
    return operateList.map((item) => {
      return {
        key: item.id,
        label: (
          <div className="flex items-center">
            <div>{ item.title}</div>
            <div className={`${item.icon} ml-[5px]`}></div>
          </div>
        ),
        disabled: operateDisabled(item.id),
      }
    })
  }, [activeKey, tabsList])

  useEffect(() => {
    console.log(tabsList)
    if (location.pathname === activeKey)
      return

    const item = routerList.find(item => item.key === location.pathname)
    const index = tabsList.findIndex(item => item.key === location.pathname)

    if (index === -1 && item) {
      console.log('item', item)
      addTabs({ ...item, closable: item.key !== ROOT_INDEX })
    }
    setActiveKey(location.pathname)
  }, [activeKey, addTabs, location.pathname, routerList, tabsList])

  return (
    <div
      className="flex items-center overflow-hidden px-[5px]"
    >
      <div className="flex-1 overflow-hidden">
        <Tabs
          className="custom-app-tabs"
          hideAdd
          activeKey={activeKey}
          items={tabsList}
          type="editable-card"
          onChange={key => setActiveKey(key)}
          onEdit={onEdit}
          onTabClick={key => navigate(key)}
        />
      </div>
      <Dropdown menu={{ items: dropdownList, onClick: onDropdownClick }} placement="bottomRight">
        <div
          className="icon-[bi--grid-fill] ml-auto w-[50px] flex-shrink-0 cursor-pointer text-[16px]"
        >
        </div>
      </Dropdown>
    </div>
  )
}

export default AppTabs
