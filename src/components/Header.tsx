export default function Header() {
  return (
    <header className={'flex items-center justify-between'}>
      <div>&nbsp;</div>
      <div className={'size-12'}>
        <a
          href='https://github.com/Abhijit47/react-md-text-editor'
          target='_blank'
          className={''}>
          <img
            src='/github-mark.svg'
            alt='github mark'
            width={30}
            height={30}
            className={'w-full h-full object-cover'}
          />
        </a>
      </div>
    </header>
  );
}
