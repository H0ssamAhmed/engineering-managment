import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import { Bell, BookOpenCheck, Loader } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Notification, ROUTE_PATHS } from '@/lib'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const UserNotificatio = () => {
  const { currentUserNotifaction } = useUsers()
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const read = currentUserNotifaction.filter((notifi) => (notifi.is_read))
  const unread = currentUserNotifaction.filter((notifi) => (!notifi.is_read))

  return (
    <DropdownMenu dir='rtl' open={isOpen} onOpenChange={setIsOpen} >
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute -top-2 -right-2 w-6 h-6  text-md text-primary bg-primary/10 rounded-full border-2 border-background ">{unread.length || 0}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4 max-h-80 overflow-auto  " align="center" >

        <DropdownMenuGroup>
          <DropdownMenuLabel className={cn(unread.length == 0 && "hidden")}>غير مقروء</DropdownMenuLabel>
          {unread.map((notification) => {
            return <NotificationRow notification={notification} setIsOpen={setIsOpen} />
          })}

        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className={cn(read.length == 0 && "hidden")}> مقروء</DropdownMenuLabel>
          {read.map((notification) => {
            return <NotificationRow notification={notification} setIsOpen={setIsOpen} />
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}

export default UserNotificatio


const NotificationRow = (
  { notification, setIsOpen }: {
    notification: Notification, setIsOpen: Dispatch<SetStateAction<boolean>>

  }) => {
  const { changeNotificationState, isChangingNotifiState } = useUsers()
  const handleMarkAsRead = () => {
    setIsOpen(true)
    setIsOpen(true)
    changeNotificationState({ id: notification.id, is_read: !notification.is_read });
  };
  return (
    <DropdownMenuItem className='flex items-center justify-between'>
      <Link to={`${ROUTE_PATHS.PROJECTS}/${notification.project_id}`}> {notification.message}</Link>
      {isChangingNotifiState ?
        <Loader className='animate-spin' /> :
        <Tooltip delayDuration={0} >
          <TooltipTrigger>
            <BookOpenCheck
              onClick={handleMarkAsRead}
              className='bg-primary/50 hover:bg-primary cursor-pointer p-0.5 w-6 h-6 rounded-sm' />
          </TooltipTrigger>
          <TooltipContent className="cursor-pointer" >
            <p >تميز كــ {notification.is_read ? "غير مقروء" : "مقروء"}</p>
          </TooltipContent>
        </Tooltip>
      }
    </DropdownMenuItem>
  )
}