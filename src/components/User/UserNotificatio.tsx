import React, { Dispatch, SetStateAction, useState } from 'react'
import { Bell, BookOpenCheck, Loader } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { formateDateGetDay, Notification, ROUTE_PATHS } from '@/lib'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

const UserNotificatio = () => {
  const { currentUserNotifaction } = useUsers()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const read = currentUserNotifaction.filter((notifi) => (notifi.is_read))
  const unread = currentUserNotifaction.filter((notifi) => (!notifi.is_read))



  return (
    <DropdownMenu dir='rtl' open={isOpen} onOpenChange={setIsOpen} >
      <DropdownMenuTrigger>
        <div className='relative w-10 h-10 flex items-center justify-center hover:bg-primary/10 rounded-md'>
          <Bell size={20} />
          <span className="absolute -top-2 -right-2 w-6 h-6  text-md text-primary bg-primary/10 rounded-full border-2 border-background ">{unread.length || 0}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-4 max-h-96 overflow-auto  " align="center" >
        {!currentUserNotifaction.length && <p className='text-center' > لا يوجد اشعارات <Bell className='inline-block' size={20} /></p>}
        <DropdownMenuGroup>
          <DropdownMenuLabel className={cn(unread.length == 0 && "hidden")}>غير مقروء</DropdownMenuLabel>
          {unread.map((notification) => <NotificationRow key={notification.id} notification={notification} setIsOpen={setIsOpen} />)}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className={cn(read.length == 0 && "hidden")}> مقروء</DropdownMenuLabel>
          {read.map((notification) => <NotificationRow key={notification.id} notification={notification} setIsOpen={setIsOpen} />)}
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
    <DropdownMenuItem className='flex gap-4 my-4 p-2 items-start justify-between'>
      <div className=' flex flex-col gap-4'>
        <Link className='text-gray-800 font-semibold' to={`${ROUTE_PATHS.PROJECTS}/${notification.project_id}`}> {notification.message}</Link>
        <Badge className='w-fit py-1 text-gray-500' variant="outline">
          {formateDateGetDay(notification.created_at)}
        </Badge>
      </div>
      {isChangingNotifiState ?
        <Loader className='animate-spin' /> :
        <Tooltip delayDuration={0} >
          <TooltipTrigger>
            <BookOpenCheck
              onClick={handleMarkAsRead}
              className='bg-primary/50 hover:bg-primary cursor-pointer p-0.5 w-7 h-7 rounded-sm' />
          </TooltipTrigger>
          <TooltipContent className="cursor-pointer" >
            <p >تميز كــ {notification.is_read ? "غير مقروء" : "مقروء"}</p>
          </TooltipContent>
        </Tooltip>
      }
    </DropdownMenuItem>
  )
}