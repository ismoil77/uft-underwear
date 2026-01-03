'use client'

export default function TermsPage() {
	return (
		<div className='container py-12 max-w-4xl'>
			<h1 className='text-3xl font-bold mb-8'>Публичная оферта</h1>
			<div className='prose max-w-none text-text-muted'>
				<p>
					Настоящий документ является официальным предложением (публичной
					офертой) интернет-магазина UFT.
				</p>
				<h2 className='text-xl font-semibold mt-6 mb-3 text-text'>
					1. Общие положения
				</h2>
				<p>
					Данное предложение адресовано любому физическому лицу и является
					официальным предложением заключить договор купли-продажи товаров.
				</p>
				<h2 className='text-xl font-semibold mt-6 mb-3 text-text'>
					2. Оформление заказа
				</h2>
				<p>
					Заказ оформляется через сайт или по телефону. После оформления заказа
					с вами свяжется менеджер для подтверждения.
				</p>
				<h2 className='text-xl font-semibold mt-6 mb-3 text-text'>
					3. Доставка
				</h2>
				<p>
					Доставка осуществляется по всей России курьерскими службами или Почтой
					России. Сроки доставки зависят от региона.
				</p>
				<h2 className='text-xl font-semibold mt-6 mb-3 text-text'>
					4. Возврат и обмен
				</h2>
				<p>
					Возврат и обмен товара надлежащего качества возможен в течение 14 дней
					с момента покупки при сохранении товарного вида.
				</p>
			</div>
		</div>
	)
}
